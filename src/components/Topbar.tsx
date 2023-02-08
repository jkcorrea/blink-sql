import { Link } from 'react-router-dom'

import ProjectIcon from '~icons/tabler/database'
import HomeIcon from '~icons/tabler/letter-case'

interface Props {
  projectName: string
}

export const Topbar = (props: Props) => {
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
            <Link to="/">
              <ProjectIcon class="h-3 w-3" />
              <span class="ml-2 text-sm">{props.projectName}</span>
            </Link>
          </li>
        </ul>
      </div>

      <div class="flex h-full items-center" />
    </div>
  )
}
