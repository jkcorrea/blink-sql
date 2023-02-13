import { useQuery } from '@tanstack/react-query'
import type { LoaderFunction } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

import { ProjectSidebar, ProjectSidebarLoader } from '~/components/ProjectSidebar'
import { Q, queryClient } from '~/services/query-client'

const projectQuery = Q.project.detail('1')
const tablesQuery = Q.project.detail('1')._ctx.tables

export default function ProjectIndex() {
  const { data: project } = useQuery(projectQuery)
  const { data: tables } = useQuery(tablesQuery)

  if (!project || !tables) return ProjectSidebarLoader

  return (
    <div className="relative flex h-full w-full overflow-hidden whitespace-nowrap">
      {/* Left Sidebar */}
      <ProjectSidebar project={project} tables={tables} />

      {/* Main content */}
      <Outlet />
    </div>
  )
}

export const loader: LoaderFunction = async ({ params: _ }) => {
  return Promise.all([queryClient.fetchQuery(tablesQuery), queryClient.fetchQuery(projectQuery)])
}

export const Loader = ProjectSidebarLoader
