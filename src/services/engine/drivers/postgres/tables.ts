import { z } from 'zod'

import type { Table } from '~/types/project'

export const TABLES_INTROSPECTION_QUERY = /* sql */ `
SELECT t.table_name,
       t.table_schema
FROM information_schema.tables t
WHERE t.table_type = 'BASE TABLE'
ORDER BY t.table_name;
`

export const TablesResultSchema = z.array(
  z.object({
    table_name: z.string(),
    table_schema: z.string(),
  }),
)
type TablesResult = z.infer<typeof TablesResultSchema>[number]

export const toTable = ({ table_name, table_schema }: TablesResult): Table => ({
  id: `${table_schema}.${table_name}`,
  name: table_name,
  schema: table_schema,
})
