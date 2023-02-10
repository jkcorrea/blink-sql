import { useQuery } from '@tanstack/react-query'
import type { LoaderFunctionArgs } from 'react-router-dom'
import { Link, Outlet } from 'react-router-dom'

import { Q, queryClient } from '~/services/query-client'
import ProjectIcon from '~icons/tabler/database'
import HomeIcon from '~icons/tabler/letter-case'

// TODO get prj id from url
const PROJECT_ID = '1'
const prjQuery = Q.project.detail(PROJECT_ID)

export default function RootIndex() {
  const prj = useQuery(prjQuery)

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden">
      <div class="bg-base-300 h-topbar relative flex w-full items-stretch justify-between px-5">
        <div class="breadcrumbs flex h-full items-center text-sm">
          <ul>
            <li>
              <Link to="/">
                <HomeIcon class="h-3 w-3" />
                <span class="ml-2 text-sm">Home</span>
              </Link>
            </li>
            <li>
              <Link to="/p/1">
                <ProjectIcon class="h-3 w-3" />
                <span class="ml-2 text-sm">{prj.data?.name}</span>
              </Link>
            </li>
          </ul>
        </div>

        <div class="flex h-full items-center" />
      </div>

      <Outlet />
    </main>
  )
}

export const loader = async ({ params: _ }: LoaderFunctionArgs) => {
  return queryClient.fetchQuery(prjQuery)
}
