import { useQuery } from '@tanstack/react-query'
import type { LoaderFunction } from 'react-router-dom'
import { useParams } from 'react-router-dom'

import { Table as TableUI } from '~/components/Table'
import { TableStoreProvider } from '~/components/Table/TableStore'
import { Q, queryClient } from '~/services/query-client'

const columnsQuery = (projectId: string, tableId: string) => Q.project.detail(projectId)._ctx.columns(tableId)

const dataQuery = (projectId: string, tableId: string) => Q.project.detail(projectId)._ctx.data(tableId)

export default function ProjectTable() {
  const { projectId, tableId } = useParams() ?? {}
  const columns = useQuery(columnsQuery(projectId!, tableId!))
  const data = useQuery(dataQuery(projectId!, tableId!))

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

export const loader: LoaderFunction = async ({ params: { projectId, tableId } = {} }) => {
  return Promise.all([
    queryClient.fetchQuery(columnsQuery(projectId!, tableId!)),
    queryClient.fetchQuery(dataQuery(projectId!, tableId!)),
  ])
}
