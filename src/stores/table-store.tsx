import { createContextProvider } from '@solid-primitives/context'
import { capitalCase } from 'change-case'
import { sortBy } from 'rambda'
import { createMemo } from 'solid-js'
import { createStore } from 'solid-js/store'

import { SelectedCell } from '~/components/Table/types'
import { DEFAULT_ROW_HEIGHT, FieldType } from '~/lib/constants'

import { Column } from './database-store/types'

import data from '~/lib/constants/data.json'

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
  {} as Record<string, Column>,
)

interface TableState {
  columns: Record<string, Column>
  readonly columnsOrdered: Column[]
  /** The currently selected cell in format: `rowId_columnId` */
  selectedCell: SelectedCell | null | undefined
  rowHeight: number
  dirtyFields: Record<string, any>
  hiddenColumns: Column['id'][]
}

interface TableActions {
  addColumn: (column: Column) => void
  updateColumn: (id: Column['id'], column: Partial<Omit<Column, 'id'>>) => void
  removeColumn: (id: Column['id']) => void
  setSelectedCell: (cell?: SelectedCell | null) => void
  setRowHeight: (height: number) => void
  setDirtyField: (id: string, value: any) => void
  clearDirtyField: (id: string) => void
  clearAllDirtyFields: () => void
}

function createTableStore() {
  // eslint-disable-next-line prefer-const
  let getOrderedColumns: () => Column[]

  const [state, setState] = createStore<TableState>({
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
    const cols = Object.values<Column>(state.columns)
    return sortBy(
      // If not fixed, bump it by cols.length to make sure it comes after all fixed cols
      ({ userConfig, index }) => (userConfig?.isPinned ? index : cols.length + index),
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

  const value = $([state, actions] as const)
  return value
}

const [TableProvider, _useTable] = createContextProvider(createTableStore)
const useTable = () => _useTable()!
export { TableProvider, useTable }
