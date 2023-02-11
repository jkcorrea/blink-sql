import { createQueryKeys } from '@lukemorales/query-key-factory'

import type { Column, Project, Table } from '~/types/project'

import { createDriver } from '../engine/drivers'
import type { SelectParams } from '../engine/drivers/base-driver'

// TODO: store this in localstorage
const projects: Project[] = [
  {
    id: '1',
    name: 'Project 1',
    driver: createDriver('postgres://postgres:postgres@localhost:54322/postgres?sslmode=disable'),
  },
]

const getProject = (projectId: string): Project => {
  const project = projects.find((p) => p.id === projectId)
  if (!project) throw new Error(`Project ${projectId} not found`)
  return project
}

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
          const { driver } = getProject(projectId)
          return driver.getTables()
        },
      },
      columns: (tableId: string) => ({
        queryKey: [tableId],
        queryFn: (): Promise<Column[]> => {
          const { driver } = getProject(projectId)
          return driver.getColumns(tableId)
        },
      }),
      data: (tableId: string, params?: SelectParams) => ({
        queryKey: params ? [tableId, params] : [tableId],
        queryFn: (): Promise<unknown[]> => {
          const { driver } = getProject(projectId)
          return driver.select(tableId, params)
        },
      }),
    },
  }),
})
