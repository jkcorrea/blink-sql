import {
  ColumnPinningState,
  createColumnHelper,
  createSolidTable,
  getCoreRowModel,
  VisibilityState,
} from '@tanstack/solid-table'
import { createEffect } from 'solid-js'

import { MIN_COL_WIDTH } from '~/lib/constants'
import { useTable } from '~/stores'
import { Column } from '~/stores/database-store/types'

import { getFieldProp, getFieldType } from '../fields'
import { Spinner } from '../Spinner'
import { TableBody } from './TableBody'
import { TableHeader } from './TableHeader'
import useTableHotkeys from './useTableHotkeys'

declare module '@tanstack/solid-table' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  interface ColumnMeta<TData, TValue> extends Column {}
  export interface ResourceTableProps {}
}

interface TableProps {
  data: Accessor<any[] | undefined>
  isLoading?: boolean
}
const colHelper = createColumnHelper<any>()

export function Table(props: TableProps) {
  const { data: _data, isLoading } = $destructure(props)
  // Grab columns from store & filter/transform them into React Table columns
  const [tableState] = useTable()
  const { columnsOrdered, hiddenColumns } = $destructure(tableState)

  const columns = $(
    columnsOrdered
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
  )

  const data = $(_data() ?? [])
  const table = $(
    createSolidTable<any>({
      data,
      columns,
      getCoreRowModel: getCoreRowModel(),
      manualSorting: true,
      columnResizeMode: 'onChange',
    }),
  )

  // Get user’s hidden columns from props and memoize into a `VisibilityState`
  const columnVisibility = $<VisibilityState>(
    Array.isArray(hiddenColumns) ? hiddenColumns.reduce((a, c) => ({ ...a, [c]: false }), {}) : {},
  )

  // Get frozen columns and memoize into a `ColumnPinningState`
  const columnPinning = $<ColumnPinningState>({
    left: columns
      .filter((c) => c.meta?.userConfig?.isPinned && c.id && columnVisibility[c.id] !== false)
      .map((c) => c.id!),
  })

  // const lastFrozen: string | undefined = columnPinning.left![columnPinning.left!.length - 1]
  // Track changes in column sizes
  let columnSizing = $signal(table.initialState.columnSizing)
  $mount(() => {
    table.setOptions((prev) => ({
      ...prev,
      state: {
        ...prev.state,
        columnVisibility,
        columnPinning,
        columnSizing,
      },
      onColumnSizingChange: (newSizing) =>
        (columnSizing = typeof newSizing === 'function' ? newSizing(columnSizing) : newSizing),
    }))
  })

  const { rows, rowsById } = $destructure(table.getRowModel())
  const leafColumns = $(table.getVisibleLeafColumns())

  let containerRef = $signal<HTMLDivElement>()

  createEffect(() => {
    useTableHotkeys({ rows, rowsById, leafColumns })
  })

  const showSpinner = $(isLoading || data === null)

  return (
    <div ref={(el) => (containerRef = el)} class="relative h-full w-full overflow-auto overscroll-none">
      <div
        role="grid"
        class="border-separate border-spacing-0 select-none"
        style={{
          width: `${table.getTotalSize()}px`,
        }}
      >
        <TableHeader table={table} />
        <TableBody rows={rows} leafColumns={leafColumns} columnSizing={columnSizing} containerRef={containerRef} />
      </div>

      {showSpinner && <Spinner />}
    </div>
  )
}
