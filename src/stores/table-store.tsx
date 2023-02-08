/**
 * This store combines React Context and Zustand to allow us to create multiple stores of the same type.
 *
 * E.g. if we had multiple tables up, we could have multiple instances of the table store for each one.
 */

import { createContext } from 'preact'
import type { PropsWithChildren } from 'preact/compat'
import { useContext, useRef } from 'preact/compat'
import { omit } from 'rambda'
import { createStore, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

import { DEFAULT_ROW_HEIGHT } from '~/lib/constants'
import type { Column, SelectedCell } from '~/types/project'

interface TableState {
  /** The currently selected cell in format: `rowId_columnId` */
  selectedCell: SelectedCell | null | undefined
  rowHeight: number
  dirtyFields: Record<string, any>
  hiddenColumns: Column['id'][]

  // Actions
  setSelectedCell: (cell?: SelectedCell | null) => void
  setRowHeight: (height: number) => void
  setDirtyField: (id: string, value: any) => void
  clearDirtyField: (id: string) => void
  clearAllDirtyFields: () => void
}

const createTableStore = () =>
  createStore(
    immer<TableState>((set) => ({
      selectedCell: null,
      rowHeight: DEFAULT_ROW_HEIGHT,
      dirtyFields: {},
      hiddenColumns: [],

      setSelectedCell: (cell) =>
        set((state) => {
          state.selectedCell = cell ?? null
        }),
      setRowHeight: (height) => set((state) => (state.rowHeight = height)),
      setDirtyField: (cellId, value) =>
        set((state) => {
          state.dirtyFields[cellId] = value
        }),
      clearDirtyField: (cellId) =>
        set((state) => {
          state.dirtyFields = omit([cellId], state.dirtyFields)
        }),
      clearAllDirtyFields: () => set((state) => (state.dirtyFields = {})),
    })),
  )

const Context = createContext<ReturnType<typeof createTableStore> | null>(null)

interface Props extends PropsWithChildren {}

export const TableStoreProvider = ({ children }: Props) => {
  const storeRef = useRef<ReturnType<typeof createTableStore>>()

  if (!storeRef.current) {
    storeRef.current = createTableStore()
  }

  return <Context.Provider value={storeRef.current}>{children}</Context.Provider>
}

export function useTableStore<U>(selector: (state: TableState) => U, equalityFn?: (a: U, b: U) => boolean): U {
  const store = useContext(Context)
  if (!store) {
    throw new Error('useTableStore must be used within a TableStoreProvider')
  }

  return useStore(store, selector, equalityFn)
}
