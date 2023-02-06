/**
 * Represents a selected cell in the table
 */
export interface SelectedCell {
  /**
   * The cellId of the selected cell. Corresponds with TanStack Table's cell.id property, which is `rowId_colId`
   */
  id: string
  /**
   * Whether or not the cell is currently being focused (editing the value)
   */
  isFocused: boolean
}
