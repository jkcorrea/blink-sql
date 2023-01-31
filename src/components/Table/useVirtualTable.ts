import type { Column, ColumnSizingState, Row } from '@tanstack/solid-table'
import { createVirtualizer } from '@tanstack/solid-virtual'
import { defaultRangeExtractor } from '@tanstack/virtual-core'
import { createEffect, createMemo, splitProps } from 'solid-js'

import { DEFAULT_COL_WIDTH, MIN_COL_WIDTH, TABLE_PADDING } from '~/lib/constants'
import { useTable } from '~/stores'

import { splitCellId } from './utils'

interface UseVirtualProps {
  rows: Row<any>[]
  containerRef: HTMLDivElement | undefined
  leafColumns: Column<Row<any>, unknown>[]
  columnSizing: ColumnSizingState
}

/** Virtualizes the table rows and columns with TanStack's react-virtual */
export function useVirtualTable(props: UseVirtualProps) {
  const [{ rows, columnSizing, containerRef, leafColumns }, _] = splitProps(props, [
    'rows',
    'columnSizing',
    'containerRef',
    'leafColumns',
  ])
  const [tableState] = useTable()

  // Virtualize rows
  const {
    getVirtualItems: getVirtualRows,
    getTotalSize: getTotalHeight,
    scrollToIndex: scrollToRowIndex,
  } = createVirtualizer({
    getScrollElement: () => containerRef,
    count: rows.length,
    overscan: 5,
    paddingEnd: TABLE_PADDING,
    estimateSize: () => tableState.rowHeight,
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
  } = createVirtualizer({
    getScrollElement: () => containerRef,
    horizontal: true,
    count: leafColumns.length,
    overscan: 5,
    paddingStart: TABLE_PADDING,
    paddingEnd: TABLE_PADDING,
    estimateSize: (index: number) => {
      const columnDef = leafColumns[index].columnDef
      const schemaWidth = columnDef.size
      const localWidth = columnSizing[columnDef.id || '']
      const definedWidth = localWidth || schemaWidth

      if (definedWidth === undefined) return DEFAULT_COL_WIDTH
      if (definedWidth < MIN_COL_WIDTH) return MIN_COL_WIDTH
      return definedWidth
    },

    rangeExtractor: (range) => {
      const defaultRange = defaultRangeExtractor(range)
      const frozenColumns = leafColumns.filter((c) => c.getIsPinned()).map((c) => c.getPinnedIndex())

      const combinedRange = Array.from(new Set([...defaultRange, ...frozenColumns])).sort((a, b) => a - b)

      return combinedRange
    },
  })

  // Scroll to selected cell
  createEffect(() => {
    if (!tableState.selectedCell) return
    const { rowId, colId } = splitCellId(tableState.selectedCell.id)
    const rowIdx = rows.findIndex((row) => row.id === rowId)
    const colIdx = leafColumns.findIndex((col) => col.id === colId)
    if (rowIdx > -1) scrollToRowIndex(rowIdx)
    if (colIdx > -1) scrollToColIndex(colIdx)
  })

  const getPadding = createMemo(() => ({
    top: getVirtualRows().length > 0 ? getVirtualRows()?.[0]?.start || 0 : 0,
    bottom:
      getVirtualRows().length > 0 ? getTotalHeight() - (getVirtualRows()?.[getVirtualRows().length - 1]?.end || 0) : 0,
    left: getVirtualCols().length > 0 ? getVirtualCols()?.[0]?.start || 0 : 0,
    right:
      getVirtualCols().length > 0 ? getTotalWidth() - (getVirtualCols()?.[getVirtualCols().length - 1]?.end || 0) : 0,
  }))

  return {
    scrollToRowIndex,
    scrollToColIndex,
    getVirtualRows,
    getTotalHeight,
    getVirtualCols,
    getTotalWidth,
    getPadding,
  }
}
