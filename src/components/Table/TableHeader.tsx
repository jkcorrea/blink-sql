import type { Table } from '@tanstack/react-table'
import { flexRender } from '@tanstack/react-table'

import { DEFAULT_ROW_HEIGHT } from '~/constants'
import { tw } from '~/utils/tw'

type Props = {
  table: Table<any>
}

export const TableHeader = (props: Props) => {
  return (
    <thead>
      {props.table.getHeaderGroups().map((group) => (
        <tr key={group.id}>
          {group.headers.map((header) => (
            <th
              key={header.id}
              aria-rowindex={1}
              style={{
                width: `${header.column.getSize()}px`,
                height: `${DEFAULT_ROW_HEIGHT}px`,
              }}
              class={tw(
                'sticky top-0 z-[2] inline-block px-2',
                'border-base-300 bg-base-100 rounded-none border text-left text-sm',
                // header.column.getIsPinned() === 'left' && 'right-shadow sticky left-0 !z-[3]',
              )}
            >
              {!header.isPlaceholder && flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  )
}
