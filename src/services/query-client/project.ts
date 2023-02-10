import { createQueryKeys } from '@lukemorales/query-key-factory'

import type { Column, Project, Table } from '~/types/project'
import { ConnectionConfig } from '~/utils/connection-config'

import { getDriverForConnection } from '../engine/drivers'

// TODO: store this in localstorage
const projects: Project[] = [
  {
    id: '1',
    name: 'Project 1',
    connection: ConnectionConfig.fromDatabaseUrl(
      'postgres://postgres:postgres@localhost:54322/postgres?sslmode=disable',
    ),
  },
]

export const projectQueries = createQueryKeys('project', {
  list: {
    queryKey: null,
    queryFn: (): Promise<Project[]> => Promise.resolve(projects),
  },
  detail: (projectId: string) => ({
    queryKey: [projectId],
    queryFn: (): Promise<Project | undefined> => Promise.resolve(projects.find((p) => p.id === projectId)),
    contextQueries: {
      tables: {
        queryKey: null,
        queryFn: (): Promise<Table[]> => {
          const prj = projects.find((p) => p.id === projectId)
          if (!prj) throw new Error(`Project ${projectId} not found`)
          const driver = getDriverForConnection(prj.connection)
          return driver.introspectTables()
        },
      },
      columns: (tableId: string) => ({
        queryKey: [tableId],
        queryFn: (): Promise<Column[]> => {
          const prj = projects.find((p) => p.id === projectId)
          if (!prj) throw new Error(`Project ${projectId} not found`)
          const driver = getDriverForConnection(prj.connection)
          return driver.introspectColumns(tableId)
        },
      }),
    },
  }),
})
