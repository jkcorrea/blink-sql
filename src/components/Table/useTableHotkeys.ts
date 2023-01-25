import { makeEventListener } from '@solid-primitives/event-listener'
import type { Column, Row } from '@tanstack/solid-table'
import { onCleanup } from 'solid-js'

import { useTable } from '~/stores'

interface Props {
  disabled?: boolean
  rows: Row<any>[]
  rowsById: Record<string, Row<any>>
  leafColumns: Column<any, unknown>[]
}

const SINGLE_PRESS_KEYS = new Set(['ENTER', 'ESCAPE', 'TAB', 'HOME', 'END', 'PAGEUP', 'PAGEDOWN'] as const)
const MULTI_PRESS_KEYS = new Set(['ARROWUP', 'ARROWLEFT', 'ARROWRIGHT', 'ARROWDOWN'] as const)
const VALID_KEYS = new Set([...SINGLE_PRESS_KEYS, ...MULTI_PRESS_KEYS] as const)

/**
 * Attach listeners to the page for table hotkeys like navigation, editing, etc.
 * @param table The react-table instance. Used to reference columns/rows.
 */
const useTableHotkeys = ({ disabled, rows, rowsById, leafColumns }: Props) => {
  const [{ selectedCell }, { setSelectedCell }] = useTable()
  const clear = makeEventListener(window, 'keydown', (ev) => {
    const key = ev.key.toUpperCase()
    if (disabled || !VALID_KEYS.has(key as any) || !selectedCell) return
    ev.preventDefault()

    if ((key === 'ESCAPE' || key === 'TAB') && selectedCell.isFocused) {
      setSelectedCell({ ...selectedCell, isFocused: false })
      return
    } else if (key === 'ENTER' && !selectedCell.isFocused) {
      setSelectedCell({ ...selectedCell, isFocused: true })
      return
    }

    const cellId = selectedCell.id
    // HACK: tansatck table defines a cellId as `${row.id}_${col.id}`
    const [rowIdStr, ...colIdParts] = cellId.split('_')
    let rowId = parseInt(rowIdStr, 10)
    let colId = colIdParts.join('_') // NOTE: colId can have underscores, so we join them back here
    const rowIdx = rowsById[rowId].index
    const colIdx = leafColumns.findIndex((c) => c.id === colId)

    if (rowIdx === -1 || colIdx === -1) {
      console.warn('Could not find row/col for cell', selectedCell)
      return
    }

    const isMod = ev.metaKey || ev.ctrlKey
    switch (key) {
      case 'ARROWUP': {
        if (isMod) rowId = 0
        else rowId = rowIdx > 0 ? rowIdx - 1 : rowIdx
        break
      }
      case 'ARROWDOWN': {
        if (isMod) rowId = rows.length - 1
        else rowId = rowIdx < rows.length - 1 ? rowIdx + 1 : rowIdx
        break
      }
      case 'ARROWLEFT': {
        if (isMod) colId = leafColumns[0].id
        else {
          const idx = colIdx > 0 ? colIdx - 1 : colIdx
          colId = leafColumns[idx].id
        }
        break
      }
      case 'ARROWRIGHT': {
        if (isMod) colId = leafColumns[leafColumns.length - 1].id
        else {
          const idx = colIdx < leafColumns.length - 1 ? colIdx + 1 : colIdx
          colId = leafColumns[idx].id
        }
        break
      }
      case 'PAGEUP':
      case 'HOME': {
        colId = leafColumns[0].id
        if (isMod) rowId = 0
        break
      }
      case 'PAGEDOWN':
      case 'END': {
        colId = leafColumns[leafColumns.length - 1].id
        if (isMod) rowId = rows.length - 1
        break
      }
    }

    setSelectedCell({ id: `${rowId}_${colId}`, isFocused: false })
  })
  onCleanup(() => clear())
}

export default useTableHotkeys
