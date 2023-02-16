import { useMutation, useQueryClient } from '@tanstack/react-query'
import { nanoid } from 'nanoid/non-secure'

import { MAX_RECENT_PROJECTS } from '~/constants'
import type { Project } from '~/types/project'
import { storage } from '~/utils/storage'

import { ConnectionConfig } from '../engine/drivers/connection-config'
import { getProjects, projectQueries } from './project.queries'

async function createProject({ name, databaseUrl }: { name?: string; databaseUrl: string }): Promise<Project> {
  const projects = await getProjects()

  const conn = ConnectionConfig.fromDatabaseUrl(databaseUrl)
  const project: Project = {
    id: nanoid(),
    name: name ?? 'Untitled Project',
    databaseUrl,
    driverType: conn.type,
  }

  await storage.setItem('projects', [
    project,
    ...(projects.length > MAX_RECENT_PROJECTS ? projects.slice(0, MAX_RECENT_PROJECTS - 1) : projects),
  ])

  return project
}

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient()

  return useMutation(createProject, {
    onSuccess: (project) => {
      queryClient.setQueryData(projectQueries.detail(project.id).queryKey, project)
      queryClient.invalidateQueries(projectQueries.list.queryKey)
    },
  })
}
