import { useQuery } from '@tanstack/react-query'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import type { LoaderFunction } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

import { ProjectSidebar, ProjectSidebarLoader } from '~/components/ProjectSidebar'
import { Q, queryClient } from '~/services/query-client'

const projectQuery = Q.project.detail('1')
const tablesQuery = Q.project.detail('1')._ctx.tables

export default function ProjectIndex() {
  const { data: project } = useQuery(projectQuery)
  const { data: tables } = useQuery(tablesQuery)

  if (!project || !tables) return <ProjectSidebarLoader />

  return (
    <PanelGroup
      autoSaveId={project.id}
      disablePointerEventsDuringResize
      direction="horizontal"
      className="overflow-hidden whitespace-nowrap"
    >
      {/* Left Sidebar */}
      <Panel order={1} defaultSize={20} minSize={10} maxSize={30}>
        <ProjectSidebar project={project} tables={tables} />
      </Panel>

      <PanelResizeHandle className="relative w-[2px] bg-gray-300 outline-none hover:bg-gray-400" />

      {/* Main content */}
      <Panel order={2}>
        <Outlet />
      </Panel>
    </PanelGroup>
  )
}

export const loader: LoaderFunction = async ({ params: _ }) => {
  return Promise.all([queryClient.fetchQuery(tablesQuery), queryClient.fetchQuery(projectQuery)])
}

export const Loader = ProjectSidebarLoader
