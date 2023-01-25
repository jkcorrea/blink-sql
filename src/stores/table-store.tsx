import { capitalCase } from 'change-case'
import { sortBy } from 'rambda'
import { createContext, createMemo, ParentComponent, useContext } from 'solid-js'

import { ColumnConfig, SelectedCell } from '~/components/Table/types'
import { DEFAULT_ROW_HEIGHT, FieldType } from '~/constants'

import data from '~/constants/data.json'

const columns = Object.keys(data[0]).reduce(
  (obj, id, index) => ({
    ...obj,
    [id]: {
      fieldName: id,
      type: FieldType.TEXT,
      name: capitalCase(id),
      isPinned: index < 1,
      id,
      index,
    },
  }),
  {} as Record<string, ColumnConfig>,
)

export interface TableState {
  columns: Record<string, ColumnConfig>
  readonly columnsOrdered: ColumnConfig[]
  /** The currently selected cell in format: `rowId_columnId` */
  selectedCell: SelectedCell | null | undefined
  rowHeight: number
  dirtyFields: Record<string, any>
  hiddenColumns: ColumnConfig['id'][]
}

export interface TableActions {
  addColumn: (column: ColumnConfig) => void
  updateColumn: (id: ColumnConfig['id'], column: Partial<Omit<ColumnConfig, 'id'>>) => void
  removeColumn: (id: ColumnConfig['id']) => void
  setSelectedCell: (cell?: SelectedCell | null) => void
  setRowHeight: (height: number) => void
  setDirtyField: (id: string, value: any) => void
  clearDirtyField: (id: string) => void
  clearAllDirtyFields: () => void
}

export type TableContextValue = [state: TableState, actions: TableActions]

export const TableContext = createContext<TableContextValue>()

export const TableProvider: ParentComponent = (props) => {
  // eslint-disable-next-line prefer-const
  let getOrderedColumns: () => ColumnConfig[]

  const [state, setState] = $store<TableState>({
    columns,
    selectedCell: null,
    rowHeight: DEFAULT_ROW_HEIGHT,
    dirtyFields: {},
    hiddenColumns: [],
    get columnsOrdered() {
      return getOrderedColumns()
    },
  })

  // eslint-disable-next-line solid/reactivity
  getOrderedColumns = createMemo(() => {
    const cols = Object.values<ColumnConfig>(state.columns)
    return sortBy(
      // If not fixed, bump it by cols.length to make sure it comes after all fixed cols
      ({ isPinned, index }) => (isPinned ? index : cols.length + index),
      cols,
    )
  })

  const actions: TableActions = {
    addColumn(column) {
      setState('columns', (columns) => ({ ...columns, [column.id]: column }))
    },
    updateColumn(id, column) {
      setState('columns', (columns) => ({ ...columns, [id]: { ...columns[id], ...column } }))
    },
    removeColumn(id) {
      setState('columns', (columns) => {
        const { [id]: _, ...rest } = columns
        return rest
      })
    },
    setSelectedCell(cell) {
      setState('selectedCell', cell)
    },
    setRowHeight(height) {
      setState('rowHeight', height)
    },
    setDirtyField(id, value) {
      setState('dirtyFields', (fields) => ({ ...fields, [id]: value }))
    },
    clearDirtyField(id) {
      setState('dirtyFields', (fields) => {
        const { [id]: _, ...rest } = fields
        return rest
      })
    },
    clearAllDirtyFields() {
      setState('dirtyFields', {})
    },
  }

  return <TableContext.Provider value={[state, actions]}>{props.children}</TableContext.Provider>
}

export const useTable = () => useContext(TableContext)!
