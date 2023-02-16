import { Link } from 'react-router-dom'

import type { Project } from '~/types/project'
import ProjectIcon from '~icons/tabler/database'
import HomeIcon from '~icons/tabler/letter-case'

interface Props {
  project: Project
  tableName?: string
}

const Topbar = ({ project, tableName }: Props) => {
  return (
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
            <Link to={`/p/${project.id}`}>
              <ProjectIcon class="h-3 w-3" />
              <span class="ml-2 text-sm">{project.name}</span>
            </Link>
          </li>
          {tableName && (
            <li>
              <ProjectIcon class="h-3 w-3" />
              <span class="ml-2 text-sm">{project.name}</span>
            </li>
          )}
        </ul>
      </div>

      <div class="flex h-full items-center" />
    </div>
  )
}
export default Topbar
