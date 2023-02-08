import { useQuery } from '@tanstack/react-query'
import type { LoaderFunction } from 'react-router-dom'
import { json, useLoaderData } from 'react-router-dom'

import { Table } from '~/components/Table'
import { useProjectStore } from '~/stores/project-store'
import { TableStoreProvider } from '~/stores/table-store'

export default function ProjectTable() {
  const { tableName } = useLoaderData() as { tableName: string }
  const { table, exec } = useProjectStore(({ tables, exec }) => ({ table: tables[tableName], exec }))

  const columns = table?.columns ?? []

  const { data, isLoading } = useQuery(
    ['project', tableName, 'select'],
    async () => exec<any[]>(`SELECT * FROM ${`${table?.schema}.` ?? ''}${tableName}`),
    { enabled: Boolean(table) },
  )

  return (
    <TableStoreProvider>
      <Table columns={columns} data={data ?? []} isLoading={isLoading} />
    </TableStoreProvider>
  )
}

export const loader: LoaderFunction = async ({ params }) => {
  return json({ tableName: params.tableName }, { headers: { 'cache-control': 'no-store' } })
}
