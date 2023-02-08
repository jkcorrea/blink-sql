import type { Column, Row } from '@tanstack/react-table'
import { useHotkeys } from 'react-hotkeys-hook'

import { useTableStore } from '~/stores/table-store'

interface Props {
  rows: Row<any>[]
  rowsById: Record<string, Row<any>>
  leafColumns: Column<any, unknown>[]
}

const HOTKEYS = [
  // Navigation
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'ArrowDown',
  'Home',
  'End',
  'PageUp',
  'PageDown',
  // Editing
  'Enter',
  'Escape',
  'Tab',
].join(',')

/**
 * Attach listeners to the page for table hotkeys like navigation, editing, etc.
 * @param table The react-table instance. Used to reference columns/rows.
 */
const useTableHotkeys = ({ rows, rowsById, leafColumns }: Props) => {
  const { selectedCell, setSelectedCell } = useTableStore(({ selectedCell, setSelectedCell }) => ({
    selectedCell,
    setSelectedCell,
  }))

  useHotkeys(
    HOTKEYS,
    (ev) => {
      if (!selectedCell) return

      if (['Escape', 'Tab'].includes(ev.key) && selectedCell.isFocused) {
        setSelectedCell({ ...selectedCell, isFocused: false })
      } else if (ev.key === 'Enter' && !selectedCell.isFocused) {
        setSelectedCell({ ...selectedCell, isFocused: true })
      }

      const cellId = selectedCell.id
      // HACK: react-table defines a cellId as `${row.id}_${col.id}`
      const [rowIdStr, ...colIdParts] = cellId.split('_')
      let rowId = parseInt(rowIdStr, 10)
      let colId = colIdParts.join('_') // NOTE: colId can have underscores, so we join them back here
      const rowIdx = rowsById[rowId].index
      const colIdx = leafColumns.findIndex((c) => c.id === colId)

      if (rowIdx === -1 || colIdx === -1) {
        console.warn('Could not find row/col for cell', selectedCell)
        return
      }

      switch (ev.key) {
        case 'ArrowUp': {
          if (ev.ctrlKey || ev.metaKey) rowId = 0
          else rowId = rowIdx > 0 ? rowIdx - 1 : rowIdx
          break
        }
        case 'ArrowDown': {
          if (ev.ctrlKey || ev.metaKey) rowId = rows.length - 1
          else rowId = rowIdx < rows.length - 1 ? rowIdx + 1 : rowIdx
          break
        }
        case 'ArrowLeft': {
          if (ev.ctrlKey || ev.metaKey) colId = leafColumns[0].id
          else {
            const idx = colIdx > 0 ? colIdx - 1 : colIdx
            colId = leafColumns[idx].id
          }
          break
        }
        case 'ArrowRight': {
          if (ev.ctrlKey || ev.metaKey) colId = leafColumns[leafColumns.length - 1].id
          else {
            const idx = colIdx < leafColumns.length - 1 ? colIdx + 1 : colIdx
            colId = leafColumns[idx].id
          }
          break
        }
        case 'PageUp':
        case 'Home': {
          colId = leafColumns[0].id
          if (ev.ctrlKey || ev.metaKey) rowId = 0
          break
        }
        case 'PageDown':
        case 'End': {
          colId = leafColumns[leafColumns.length - 1].id
          if (ev.ctrlKey || ev.metaKey) rowId = rows.length - 1
          break
        }
      }

      setSelectedCell({ id: `${rowId}_${colId}`, isFocused: false })
    },
    { enableOnFormTags: true, preventDefault: true },
    [rows, rowsById, leafColumns, selectedCell, setSelectedCell],
  )
}

export default useTableHotkeys
