import { flexRender, Table } from '@tanstack/solid-table'
import { For } from 'solid-js'

import { DEFAULT_ROW_HEIGHT } from '~/lib/constants'
import { tw } from '~/lib/utils'

type Props = {
  table: Table<any>
}

export const TableHeader = (props: Props) => {
  return (
    <thead>
      <For each={props.table.getHeaderGroups()}>
        {(group) => (
          <tr>
            <For each={group.headers}>
              {(header) => (
                <th
                  aria-rowindex={1}
                  colSpan={header.colSpan}
                  style={{
                    width: `${header.column.getSize()}px`,
                    height: `${DEFAULT_ROW_HEIGHT}px`,
                  }}
                  class={tw(
                    'border-base-300 bg-base-100 sticky top-0 z-[2] rounded-none border align-middle text-sm',
                    // header.column.getIsPinned() === 'left' && 'right-shadow sticky left-0 !z-[3]',
                  )}
                >
                  {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              )}
            </For>
          </tr>
        )}
      </For>
    </thead>
  )
}
