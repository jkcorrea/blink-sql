import { useQuery } from '@tanstack/react-query'
import { useState } from 'preact/hooks'
import { defer, redirect } from 'react-router-dom'

import wand from '~/assets/wand.svg'
import { Q, queryClient, useCreateProjectMutation } from '~/services/query-client'

const projectsQuery = Q.project.list

export default function LauncherPage() {
  const projects = useQuery(projectsQuery)
  const [databaseUrl, setDatabaseUrl] = useState('')
  const mut = useCreateProjectMutation()

  const createProject = async () => {
    const prj = await mut.mutateAsync({
      databaseUrl,
    })

    redirect(`/p/${prj.id}`)
  }

  return (
    <main className="container relative mx-auto flex h-screen w-screen flex-col overflow-hidden  p-10">
      <div className="flex items-center justify-center">
        <a
          href="https://blink-sql.com"
          target="_blank"
          rel="noreferrer"
          class="flex items-center justify-center space-x-2"
        >
          <img src={wand} alt="Blink SQL" className="h-12" />
          <h1 className="text-primary text-3xl font-bold uppercase tracking-wide">Blink SQL</h1>
        </a>
      </div>

      <div class="mt-10 flex items-center justify-center gap-x-2">
        <input
          class="input input-bordered"
          type="text"
          placeholder="Database URL"
          value={databaseUrl}
          onChange={(e) => setDatabaseUrl(e.currentTarget.value)}
        />
        <button class="btn btn-primary" onClick={createProject}>
          Connect
        </button>
      </div>

      <div class="mt-10 flex items-center justify-center gap-x-2">
        <h1 class="justify-self-start text-lg font-bold">Recents</h1>
        <div class="flex flex-col gap-y-2">
          {projects.data?.map((project) => (
            <a href={`/p/${project.id}`} class="btn btn-ghost">
              {project.name}
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}

export const loader = () => {
  return defer({
    projects: queryClient.fetchQuery(projectsQuery),
  })
}
