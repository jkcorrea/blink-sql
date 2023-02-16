import { createQueryKeys } from '@lukemorales/query-key-factory'
import { z } from 'zod'

import type { Column, Project, Table } from '~/types/project'
import { ProjectSchema } from '~/types/project'
import { storage } from '~/utils/storage'

import { getDriver } from '../engine/drivers'
import type { BaseDriver, SelectParams } from '../engine/drivers/base-driver'

export const projectQueries = createQueryKeys('project', {
  list: {
    queryKey: null,
    queryFn: getProjects,
  },
  detail: (projectId: string) => ({
    queryKey: [projectId],
    queryFn: () => getProject(projectId),
    contextQueries: {
      tables: {
        queryKey: null,
        queryFn: async (): Promise<Table[]> => {
          const driver = await getDriverForProject(projectId)
          return driver.getTables()
        },
      },
      columns: (tableId: string) => ({
        queryKey: [tableId],
        queryFn: async (): Promise<Column[]> => {
          const driver = await getDriverForProject(projectId)
          return driver.getColumns(tableId)
        },
      }),
      data: (tableId: string, params?: SelectParams) => ({
        queryKey: params ? [tableId, params] : [tableId],
        queryFn: async (): Promise<unknown[]> => {
          const driver = await getDriverForProject(projectId)
          return driver.select(tableId, params)
        },
      }),
    },
  }),
})

export async function getProjects(): Promise<Project[]> {
  const store = (await storage.getItem('projects')) ?? []
  try {
    return z.array(ProjectSchema).parse(store)
  } catch (err) {
    console.error('Invalid projects store', err)
    // storage.setItem('projects', [])
    return []
  }
}

export async function getProject(projectId: string): Promise<Project> {
  const projects = await getProjects()
  const project = projects.find((p) => p.id === projectId)
  if (!project) throw new Error(`Project ${projectId} not found`)
  return project
}

export async function getDriverForProject(projectId: string): Promise<InstanceType<typeof BaseDriver>> {
  const { databaseUrl } = await getProject(projectId)
  return getDriver(databaseUrl)
}
