import { z } from 'zod'

import { FieldType, SqlDriverType } from '~/constants'
import type { Column, Table } from '~/types/project'

import { BaseDriver } from './base'

const TABLES_INTROSPECTION_QUERY = /* sql */ `
SELECT t.table_name,
       t.table_schema
FROM information_schema.tables t
WHERE t.table_type = 'BASE TABLE'
ORDER BY t.table_name;
`

const TablesResultSchema = z.array(
  z.object({
    table_name: z.string(),
    table_schema: z.string(),
  }),
)
type TablesResult = z.infer<typeof TablesResultSchema>[number]

const toTable = ({ table_name, table_schema }: TablesResult): Table => ({
  id: `${table_schema}.${table_name}`,
  name: table_name,
  schema: table_schema,
})

const COLUMNS_INTROSPECTION_QUERY = (tableId: string) => /* sql */ `
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
FROM information_schema.columns c
  JOIN information_schema.tables t
    ON ( t.table_name = c.table_name
      AND c.table_schema = t.table_schema )
WHERE t.table_type = 'BASE TABLE'
  AND t.table_name = '${tableId.split('.')[1]}'
  AND t.table_schema = '${tableId.split('.')[0]}'
ORDER BY c.table_schema,
         c.table_name,
         c.ordinal_position;
`

/** Represents the results of an introspection for Postgres databases. */
const ColumnsResultSchema = z.array(
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
type ColumnResult = z.infer<typeof ColumnsResultSchema>[number]

function toColumn(result: ColumnResult): Column {
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
    id: `${table_schema}.${column_name}`,
    type,
    name: column_name,
    schema: table_schema,
    index: ordinal_position,
    isReadonly: is_updatable || is_generated === 'ALWAYS',
    isNullable: is_nullable && is_generated !== 'ALWAYS',
  }
}

export class PostgresDriver extends BaseDriver {
  type = SqlDriverType.POSTGRES

  async introspectTables(): Promise<Table[]> {
    const res = await this.exec(TABLES_INTROSPECTION_QUERY)
    return TablesResultSchema.parse(res).map(toTable)
  }

  async introspectColumns(tableId: string): Promise<Column[]> {
    const res = await this.exec(COLUMNS_INTROSPECTION_QUERY(tableId))
    return ColumnsResultSchema.parse(res).map(toColumn)
  }
}
