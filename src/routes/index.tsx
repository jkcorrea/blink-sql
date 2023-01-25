import { capitalCase } from 'change-case'
import { For } from 'solid-js'
import { A } from 'solid-start'

import { Table } from '~/components/Table'
import { Topbar } from '~/components/Topbar'
import { TableProvider } from '~/stores'

import data from '~/constants/data.json'

const tables = ['users', 'posts', 'comments']

export default function Home() {
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
          <Table data={data} />
        </TableProvider>
      </div>
    </main>
  )
}
