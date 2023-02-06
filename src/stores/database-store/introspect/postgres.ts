import { z } from 'zod'

import { FieldType } from '~/lib/constants'

import { Column, IntrospectionFn, Table } from '../types'

const PG_INTROSPECTION_QUERY = /* sql */ `
SELECT c.table_schema,
       c.table_name,
       c.column_name,
       c.data_type,
       c.udt_name,
       c.ordinal_position,
       c.column_default,
       c.is_nullable,
       c.is_updatable,
       c.is_generated
FROM   information_schema.columns c
       JOIN information_schema.tables t
         ON ( t.table_name = c.table_name
              AND c.table_schema = t.table_schema )
WHERE t.table_type = 'BASE TABLE'
ORDER BY c.table_schema,
         c.table_name,
         c.ordinal_position;
`

/** Represents the results of an introspection for Postgres databases. */
const PgIntrospectionResultSchema = z.array(
  z.object({
    table_schema: z.string(),
    table_name: z.string(),
    column_name: z.string(),
    data_type: z.string(),
    udt_name: z.string(),
    ordinal_position: z.number(),
    column_default: z.any().optional(),
    is_nullable: z.preprocess((v) => (typeof v === 'string' ? v === 'YES' : v), z.boolean()),
    is_updatable: z.preprocess((v) => (typeof v === 'string' ? v === 'YES' : v), z.boolean()),
    is_generated: z.union([z.literal('ALWAYS'), z.literal('NEVER'), z.literal('BY DEFAULT')]),
  }),
)
type PgIntrospectionResult = z.infer<typeof PgIntrospectionResultSchema>[number]

function toColumn(result: PgIntrospectionResult): Column {
  const {
    table_schema,
    column_name,
    ordinal_position,
    // TODO parse data types properly
    data_type: _,
    is_updatable,
    is_nullable,
    is_generated,
  } = result

  const type = FieldType.TEXT

  return {
    id: column_name,
    type,
    name: column_name,
    schema: table_schema,
    index: ordinal_position,
    isReadonly: is_updatable || is_generated === 'ALWAYS',
    isNullable: is_nullable && is_generated !== 'ALWAYS',
  }
}

export const introspect: IntrospectionFn = async (exec) => {
  const res = await exec(PG_INTROSPECTION_QUERY)

  const cols = PgIntrospectionResultSchema.parse(res)

  return cols.reduce((acc, result) => {
    const { table_name, column_name, table_schema } = result

    const table = acc[table_name] ?? { name: table_name, schema: table_schema, columns: {} }
    const column = toColumn(result)

    table.columns[column_name] = column

    acc[table_name] = table

    return acc
  }, {} as Record<string, Table>)
}
