import type { Column, ColumnSizingState, Row } from '@tanstack/react-table'

// import { TableServiceProvider, useTableService } from './TableService'
import { OUT_OF_ORDER_MARGIN } from '~/lib/constants'
import { tw } from '~/lib/utils'
import { useTableStore } from '~/stores/table-store'

import { TableCell } from './TableCell'
import { useVirtualTable } from './useVirtualTable'

export interface TableBodyProps {
  containerRef: React.RefObject<HTMLDivElement>
  leafColumns: Column<any, any>[]
  rows: Row<any>[]
  columnSizing: ColumnSizingState
}

export function TableBody({ rows, columnSizing, containerRef, leafColumns }: TableBodyProps) {
  const rowHeight = useTableStore(({ rowHeight }) => rowHeight)
  const { virtualCols, virtualRows, paddingTop, paddingBottom, paddingLeft, paddingRight } = useVirtualTable({
    rows,
    containerRef,
    leafColumns,
    columnSizing,
  })

  return (
    <tbody>
      {paddingTop > 0 && <div role="presentation" style={{ height: `${paddingTop}px` }} />}

      {virtualRows.map((vRow) => {
        const row = rows[vRow.index]
        const outOfOrder = false // TODO do we need this logic
        const rowCells = row.getVisibleCells()

        return (
          <tr
            key={row.id}
            role="row"
            class={tw('group relative flex', row.getIsSelected() && 'active')}
            style={{
              height: `${rowHeight}px`,
              'margin-bottom': `${outOfOrder ? OUT_OF_ORDER_MARGIN : 0}px`,
              'padding-left': `${paddingLeft}px`,
              'padding-right': `${paddingRight}px`,
            }}
          >
            {virtualCols.map((vCell) => {
              const cell = rowCells[vCell.index]

              return (
                <TableCell
                  key={cell.id}
                  cell={cell}
                  width={cell.column.getSize()}
                  height={rowHeight}
                  left={vCell.start}
                  isPinned={!!cell.getContext().column.getIsPinned()}
                />
              )
            })}
          </tr>
        )
      })}

      {paddingBottom > 0 && <div role="presentation" style={{ height: `${paddingBottom}px` }} />}
    </tbody>
  )
}
