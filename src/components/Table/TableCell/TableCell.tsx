import { Cell, flexRender } from '@tanstack/solid-table'

import { TABLE_PADDING } from '~/lib/constants'
import { tw } from '~/lib/utils'
import { useTable } from '~/stores'

import type { IRenderedTableCellProps } from './withRenderTableCell'

interface Props<TData = any> {
  cell: Cell<TData, any>
  height: number
  width: number
  /** If `isPinned === true`, used to position the cell */
  left: number
  isReadonly?: boolean
  isPinned?: boolean
}

export const TableCell = (props: Props) => {
  const { cell, isPinned, isReadonly, width, height, left } = $destructure(props)
  const [tableState, { setSelectedCell }] = useTable()
  const { selectedCell, rowHeight } = $destructure(tableState)

  const isSelected = $selector(selectedCell?.id)
  const isFocused = $(Boolean(isSelected(cell.id) && selectedCell?.isFocused))

  const setIsFocused = $((isFocused: boolean) => {
    setSelectedCell({
      id: cell.id,
      isFocused,
    })
  })
  const tableCellComponentProps = $<IRenderedTableCellProps>({
    ...cell.getContext(),
    value: cell.getValue(),
    isFocused,
    setIsFocused,
    disabled: isReadonly || cell.column.columnDef.meta?.isReadonly === false,
    rowHeight,
  })

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events
    <td
      role="gridcell"
      data-selected={isSelected(cell.id)}
      tabIndex={isSelected(cell.id) && !isFocused ? 0 : -1}
      class={tw(
        `border-base-300 bg-base-100
         absolute flex cursor-default select-none items-center whitespace-nowrap border p-1 font-mono text-xs
         before:absolute before:inset-0 before:z-[4]`,
        isPinned && 'right-shadow sticky left-0 z-[1] shadow before:z-[3]',
        isSelected(cell.id) && 'before:outline-primary/50 before:outline',
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${left - (isPinned ? TABLE_PADDING : 0)}px`,
        'line-height': `calc(${height}px - 1px})`,
      }}
      onClick={(e) => {
        if (selectedCell?.id === cell.id) return
        setSelectedCell({ id: cell.id, isFocused: false })
        e.currentTarget.focus()
      }}
      onDblClick={(e) => {
        setSelectedCell({
          id: cell.id,
          isFocused: true,
        })
        e.currentTarget.focus()
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        setSelectedCell({ id: cell.id, isFocused: false })
        e.currentTarget.focus()
        // TODO open custom context menu
      }}
    >
      {/* <ErrorBoundary fallbackRender={}> */}
      {flexRender(cell.column.columnDef.cell, tableCellComponentProps)}
      {/* </ErrorBoundary> */}
      {/* <div
        class={clsx(
          'flex h-full w-full items-center py-0 px-2',
          isSelected ? 'z-10 overflow-visible' : 'overflow-hidden',
        )}
      >
        {isFocused ? (
          <input
            onFocus={(e) => e.currentTarget.select()}
            value={value as string}
            class="h-full w-full outline-none"
            onBlur={() => {
              setSelectedCell({ id: cell.id, isFocused: false })
            }}
          />
        ) : value === null ? (
          <span class="text-base-content/40 uppercase">NULL</span>
        ) : (
          value
        )}
      </div> */}
    </td>
  )
}
