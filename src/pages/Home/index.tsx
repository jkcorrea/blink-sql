import { A } from '@solidjs/router'
import { capitalCase } from 'change-case'
import { createMemo, For } from 'solid-js'

import { Table } from '~/components/Table'
import { Topbar } from '~/components/Topbar'
import { TableProvider } from '~/stores'
import { useDatabase } from '~/stores/database-store'

const data = () => []

export default function Home() {
  const [{ tables }] = useDatabase()

  const tableNames = createMemo(() => {
    console.log(tables)
    return Object.values(tables ?? [])
      .sort()
      .map((t) => t.name)
  })

  return (
    <main class="relative flex h-screen w-screen flex-col overflow-hidden">
      <Topbar projectName="Project" />

      {/* Left Sidebar */}
      <div class="relative flex h-full w-full overflow-hidden whitespace-nowrap">
        <div class="bg-base-100 text-base-content relative h-full">
          <ul class="flex h-full flex-col overflow-auto">
            <For each={tableNames()}>
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
          <Table data={data} isLoading={false} />
        </TableProvider>
      </div>
    </main>
  )
}
