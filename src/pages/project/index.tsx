import { useQuery } from '@tanstack/react-query'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import type { LoaderFunction } from 'react-router-dom'
import { Outlet, useParams } from 'react-router-dom'

import { ProjectSidebar, ProjectSidebarLoader } from '~/components/ProjectSidebar'
import Topbar from '~/components/Topbar'
import { Q, queryClient } from '~/services/query-client'

const projectQuery = (projectId: string) => Q.project.detail(projectId)
const tablesQuery = (projectId: string) => Q.project.detail(projectId)._ctx.tables

export default function ProjectIndex() {
  const projectId = useParams().projectId!
  const { data: project } = useQuery(projectQuery(projectId))
  const { data: tables } = useQuery(tablesQuery(projectId))

  if (!project || !tables) return <ProjectSidebarLoader />

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden">
      <Topbar project={project} />

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
    </main>
  )
}

export const loader: LoaderFunction = async ({ params }) => {
  return Promise.all([
    queryClient.fetchQuery(tablesQuery(params.projectId!)),
    queryClient.fetchQuery(projectQuery(params.projectId!)),
  ])
}

export const Loader = ProjectSidebarLoader
