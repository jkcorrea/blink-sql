import { useQuery } from '@tanstack/react-query'
import { capitalCase } from 'change-case'
import type { LoaderFunction } from 'react-router-dom'
import { Link, Outlet } from 'react-router-dom'

import { Q, queryClient } from '~/services/query-client'

const tablesQuery = Q.project.detail('1')._ctx.tables

export default function ProjectIndex() {
  const tables = useQuery(tablesQuery)

  return (
    <div className="relative flex h-full w-full overflow-hidden whitespace-nowrap">
      {/* Left Sidebar */}
      <div className="bg-base-100 text-base-content relative h-full">
        <ul className="flex h-full flex-col overflow-auto">
          {Object.values(tables.data ?? []).map(({ id, name }) => (
            <Link key={id} to={`t/${id}`} className="cursor-default">
              <li className="hover:bg-primary/5 py-1 px-5">{capitalCase(name)}</li>
            </Link>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <Outlet />
    </div>
  )
}

export const loader: LoaderFunction = async ({ params: _ }) => {
  return queryClient.fetchQuery(tablesQuery)
}
