import { useCallback, useEffect } from 'react'
import type { Column, ColumnSizingState, Row } from '@tanstack/react-table'
import type { Range } from '@tanstack/react-virtual'
import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual'

import { DEFAULT_COL_WIDTH, MIN_COL_WIDTH, TABLE_PADDING } from '~/constants/table-constants'
import { useTableStore } from '~/components/Table/TableStore'

import { splitCellId } from './utils'

interface UseVirtualProps {
  rows: Row<any>[]
  containerRef: React.RefObject<HTMLDivElement>
  leafColumns: Column<Row<any>, unknown>[]
  columnSizing: ColumnSizingState
}

/** Virtualizes the table rows and columns with TanStack's react-virtual */
export function useVirtualTable({ rows, columnSizing, containerRef, leafColumns }: UseVirtualProps) {
  const { rowHeight, selectedCell } = useTableStore(({ rowHeight, selectedCell }) => ({
    rowHeight,
    selectedCell,
  }))

  // Virtualize rows
  const {
    getVirtualItems: getVirtualRows,
    getTotalSize: getTotalHeight,
    scrollToIndex: scrollToRowIndex,
  } = useVirtualizer({
    getScrollElement: () => containerRef.current,
    count: rows.length,
    overscan: 5,
    paddingEnd: TABLE_PADDING,
    estimateSize: useCallback(() => rowHeight, [rowHeight]),
    // useCallback(
    //   (index: number) => rowHeight + (rows[index]._rowy_outOfOrder ? OUT_OF_ORDER_MARGIN : 0),
    //   [rows, rowHeight],
    // ),
  })

  // Virtualize columns
  const {
    getVirtualItems: getVirtualCols,
    getTotalSize: getTotalWidth,
    scrollToIndex: scrollToColIndex,
  } = useVirtualizer({
    getScrollElement: () => containerRef.current,
    count: leafColumns.length,
    horizontal: true,
    overscan: 5,
    paddingStart: TABLE_PADDING,
    paddingEnd: TABLE_PADDING,
    estimateSize: useCallback(
      (index: number) => {
        const columnDef = leafColumns[index].columnDef
        const schemaWidth = columnDef.size
        const localWidth = columnSizing[columnDef.id || '']
        const definedWidth = localWidth || schemaWidth

        if (definedWidth === undefined) return DEFAULT_COL_WIDTH
        if (definedWidth < MIN_COL_WIDTH) return MIN_COL_WIDTH
        return definedWidth
      },
      [leafColumns, columnSizing],
    ),
    rangeExtractor: useCallback(
      (range: Range) => {
        const defaultRange = defaultRangeExtractor(range)
        const frozenColumns = leafColumns.filter((c) => c.getIsPinned()).map((c) => c.getPinnedIndex())

        const combinedRange = Array.from(new Set([...defaultRange, ...frozenColumns])).sort((a, b) => a - b)

        return combinedRange
      },
      [leafColumns],
    ),
  })

  const virtualRows = getVirtualRows()
  const totalHeight = getTotalHeight()
  const virtualCols = getVirtualCols()
  const totalWidth = getTotalWidth()

  // Scroll to selected cell
  useEffect(() => {
    if (!selectedCell) return
    const { rowId, colId } = splitCellId(selectedCell.id)
    const rowIdx = rows.findIndex((row) => row.id === rowId)
    const colIdx = leafColumns.findIndex((col) => col.id === colId)
    if (rowIdx > -1) scrollToRowIndex(rowIdx)
    if (colIdx > -1) scrollToColIndex(colIdx)
  }, [selectedCell, rows, leafColumns, scrollToRowIndex, scrollToColIndex])

  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom = virtualRows.length > 0 ? totalHeight - (virtualRows?.[virtualRows.length - 1]?.end || 0) : 0

  const paddingLeft = virtualCols.length > 0 ? virtualCols?.[0]?.start || 0 : 0
  const paddingRight = virtualCols.length > 0 ? totalWidth - (virtualCols?.[virtualCols.length - 1]?.end || 0) : 0

  return {
    virtualRows,
    totalHeight,
    scrollToRowIndex,
    virtualCols,
    totalWidth,
    scrollToColIndex,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  }
}
