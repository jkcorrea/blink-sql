import { A } from '@solidjs/router'
import { Command } from '@tauri-apps/api/shell'
import { capitalCase } from 'change-case'
import { createResource, For } from 'solid-js'

import { Table } from '~/components/Table'
import { Topbar } from '~/components/Topbar'
import { TableProvider } from '~/stores'

const tables = ['users', 'posts', 'comments']

async function fetchData() {
  let rows: any[] = []
  try {
    const sql = Command.sidecar('binaries/usql/usql', [
      '-J',
      '-q',
      '-c',
      'SELECT * from thing',
      'postgresql://postgres:postgres@localhost:54322/postgres?sslmode=disable',
    ])
    const res = await sql.execute()
    rows = JSON.parse(res.stdout)
  } catch (error) {
    console.log(error)
  }

  return rows
}

export default function Home() {
  const [data] = createResource(fetchData)

  return (
    <main class="relative flex h-screen w-screen flex-col overflow-hidden">
      <Topbar projectName="Project" />

      {/* Left Sidebar */}
      <div class="relative flex h-full w-full overflow-hidden whitespace-nowrap">
        <div class="bg-base-100 text-base-content relative h-full">
          <ul class="flex h-full flex-col overflow-auto">
            <For each={tables}>
              {(name) => (
                <li class="hover:bg-primary/10 group rounded-lg py-1 px-5">
                  <A href={`/${name}`} class="cursor-default">
                    {capitalCase(name)}
                  </A>
                </li>
              )}
            </For>
          </ul>
        </div>

        {/* Main content */}
        <TableProvider>
          <Table data={data} isLoading={data.loading} />
        </TableProvider>
      </div>
    </main>
  )
}
