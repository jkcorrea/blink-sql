import type { Column, ColumnSizingState, Row } from '@tanstack/solid-table'
import { For } from 'solid-js'

// import { TableServiceProvider, useTableService } from './TableService'
import { OUT_OF_ORDER_MARGIN } from '~/constants'
import { tw } from '~/lib/utils'
import { useTable } from '~/stores'

import { TableCell } from './TableCell'
import { useVirtualTable } from './useVirtualTable'

export interface TableBodyProps {
  containerRef: HTMLDivElement | undefined
  leafColumns: Column<any, any>[]
  rows: Row<any>[]
  columnSizing: ColumnSizingState
}

export function TableBody(props: TableBodyProps) {
  const [tableState] = useTable()
  const { rows, columnSizing, containerRef, leafColumns } = $destructure(props)
  const { getVirtualRows, getVirtualCols, getPadding } = useVirtualTable({
    rows,
    containerRef,
    leafColumns,
    columnSizing,
  })

  const virtualRows = $derefMemo(getVirtualRows)
  const virtualCols = $derefMemo(getVirtualCols)
  const padding = $derefMemo(getPadding)

  return (
    <tbody>
      {padding.top > 0 && <div role="presentation" style={{ height: `${padding.top}px` }} />}

      <For each={virtualRows}>
        {(vRow) => {
          const row = $(rows[vRow.index])
          const outOfOrder = false // TODO do we need this logic
          const rowCells = row.getVisibleCells()

          return (
            <tr
              role="row"
              class={tw('group relative flex', row.getIsSelected() && 'active')}
              style={{
                height: `${tableState.rowHeight}px`,
                'margin-bottom': `${outOfOrder ? OUT_OF_ORDER_MARGIN : 0}px`,
                'padding-left': `${padding.left}px`,
                'padding-right': `${padding.right}px`,
              }}
            >
              <For each={virtualCols}>
                {(vCell) => {
                  const cell = $(rowCells[vCell.index])

                  return (
                    <TableCell
                      cell={cell}
                      width={cell.column.getSize()}
                      height={tableState.rowHeight}
                      left={vCell.start}
                      isPinned={!!cell.getContext().column.getIsPinned()}
                    />
                  )
                }}
              </For>
            </tr>
          )
        }}
      </For>

      {padding.bottom > 0 && <div role="presentation" style={{ height: `${padding.bottom}px` }} />}
    </tbody>
  )
}
