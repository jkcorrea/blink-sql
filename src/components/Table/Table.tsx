import type { ColumnPinningState, VisibilityState } from '@tanstack/react-table'
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { useEffect, useMemo, useRef, useState } from 'preact/hooks'

import { MIN_COL_WIDTH } from '~/lib/constants'
import { useTableStore } from '~/stores/table-store'
import type { Column } from '~/types/project'

import { getFieldProp, getFieldType } from '../fields'
import { Spinner } from '../Spinner'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import useTableHotkeys from './useTableHotkeys'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData, TValue> extends Column {}
  export interface ResourceTableProps {}
}

interface TableProps {
  columns: Record<string, Column>
  data: any[] | null
  isLoading?: boolean
}
const colHelper = createColumnHelper<any>()

export function Table({ columns: _cols, data, isLoading }: TableProps) {
  // Grab columns from store & filter/transform them into React Table columns
  const { hiddenColumns, columns } = useTableStore(({ hiddenColumns }) => ({
    hiddenColumns,
    columns: Object.values(_cols)
      // TODO hiddenColumn/isHidden state is in two different places
      .filter((cfg) => !cfg.userConfig?.isHidden)
      .map((cfg) =>
        colHelper.accessor(cfg.name, {
          id: cfg.id,
          meta: cfg,
          size: cfg.userConfig?.width,
          enableResizing: cfg.userConfig?.isResizable !== false,
          minSize: MIN_COL_WIDTH,
          cell: getFieldProp('TableCell', getFieldType(cfg)),
        }),
      ),
  }))

  const table = useReactTable({
    data: data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    columnResizeMode: 'onChange',
  })

  // Get user’s hidden columns from props and memoize into a `VisibilityState`
  const columnVisibility: VisibilityState = useMemo(
    () => (Array.isArray(hiddenColumns) ? hiddenColumns.reduce((a, c) => ({ ...a, [c]: false }), {}) : {}),
    [hiddenColumns],
  )

  // Get frozen columns and memoize into a `ColumnPinningState`
  const columnPinning: ColumnPinningState = useMemo(
    () => ({
      left: columns
        .filter((c) => c.meta?.userConfig?.isPinned && c.id && columnVisibility[c.id] !== false)
        .map((c) => c.id!),
    }),
    [columns, columnVisibility],
  )
  // const lastFrozen: string | undefined = columnPinning.left![columnPinning.left!.length - 1]
  // Track changes in column sizes
  const [columnSizing, setColumnSizing] = useState(table.initialState.columnSizing)
  useEffect(() => {
    table.setOptions((prev) => ({
      ...prev,
      state: { ...prev.state, columnVisibility, columnPinning, columnSizing },
      onColumnSizingChange: setColumnSizing,
    }))
  }, [columnVisibility, columnPinning, columnSizing, table, setColumnSizing])

  // Attach hotkey listeners
  const { rows, rowsById } = table.getRowModel()
  const leafColumns = table.getVisibleLeafColumns()

  useTableHotkeys({ rows, rowsById, leafColumns })

  // Store a **state** and reference to the container element
  // so the state can re-render `TableBody`, preventing virtualization
  // not detecting scroll if the container element was initially `null`
  const containerRef = useRef<HTMLDivElement | null>(null)

  const showSpinner = isLoading || data === null

  return (
    <div ref={containerRef} class="relative h-full w-full overflow-auto overscroll-none">
      <table
        role="grid"
        class="border-separate border-spacing-0 select-none"
        style={{
          width: `${table.getTotalSize()}px`,
        }}
      >
        <TableHeader table={table} />
        <TableBody rows={rows} leafColumns={leafColumns} columnSizing={columnSizing} containerRef={containerRef} />
      </table>

      {showSpinner && <Spinner />}
    </div>
  )
}
