import { capitalCase } from 'change-case'
import type { LoaderFunction } from 'react-router-dom'
import { Link, Outlet } from 'react-router-dom'

import { Topbar } from '~/components/Topbar'
import { useProjectStore } from '~/stores/project-store'

export default function ProjectIndex() {
  const { tables } = useProjectStore(({ tables, isLoading }) => ({ tables, isLoading }))

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden">
      <Topbar projectName="Project" />

      {/* Left Sidebar */}
      <div className="relative flex h-full w-full overflow-hidden whitespace-nowrap">
        <div className="bg-base-100 text-base-content relative h-full">
          <ul className="flex h-full flex-col overflow-auto">
            {Object.values(tables).map(({ id, name }) => (
              <Link key={id} to={`t/${name}`} className="cursor-default">
                <li className="hover:bg-primary/5 py-1 px-5">{capitalCase(name)}</li>
              </Link>
            ))}
          </ul>
        </div>

        {/* Main content */}
        <Outlet />
      </div>
    </main>
  )
}

export const loader: LoaderFunction = async ({ params: _ }) => {
  // TODO
  return ''
}
