import { useQuery } from '@tanstack/react-query'
import type { LoaderFunction } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { Table as TableUI } from '~/components/Table'
import { TableStoreProvider } from '~/components/Table/TableStore'
import { Q, queryClient } from '~/services/query-client'

const columnsQuery = (tableId: string | undefined) => {
  if (!tableId) throw new Error('No table ID found')
  return Q.project.detail('1')._ctx.columns(tableId)
}

const dataQuery = (tableId: string | undefined) => {
  if (!tableId) throw new Error('No table ID found')
  return Q.project.detail('1')._ctx.data(tableId)
}

export default function ProjectTable() {
  const params = useParams()
  const columns = useQuery(columnsQuery(params.tableId))
  const data = useQuery(dataQuery(params.tableId))

  // const { data, isLoading } = useQuery(
  //   ['project', tableName, 'select'],
  //   async () => exec<any[]>(`SELECT * FROM ${`${table?.schema}.` ?? ''}${tableName}`),
  //   { enabled: Boolean(table) },
  // )

  return (
    <TableStoreProvider>
      <TableUI columns={columns.data ?? []} data={data.data ?? []} isLoading={data.isLoading} />
    </TableStoreProvider>
  )
}

export const loader: LoaderFunction = async ({ params }) => {
  return Promise.all([
    queryClient.fetchQuery(columnsQuery(params.tableId)),
    queryClient.fetchQuery(dataQuery(params.tableId)),
  ])
}
