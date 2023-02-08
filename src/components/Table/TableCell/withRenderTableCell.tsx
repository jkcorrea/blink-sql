import { useFloating } from '@floating-ui/react'
import type { CellContext } from '@tanstack/react-table'
import type { FunctionComponent } from 'preact'
import { memo, Suspense } from 'preact/compat'
import { useEffect, useRef, useState } from 'preact/hooks'
import { equals } from 'rambda'

import type { IDisplayCellProps, IEditorCellProps } from '~/components/fields/types'
import { useTableStore } from '~/stores/table-store'

export interface ICellOptions {
  /** If the rest of the row’s data is used, set this to true for memoization */
  usesRowData?: boolean
  /** Handle padding inside the cell component */
  disablePadding?: boolean
  /** Set popover background to be transparent */
  transparentPopover?: boolean
}

/** Received from `TableCell` */
export interface IRenderedTableCellProps<TData = any, TValue = any> extends CellContext<TData, TValue> {
  value: TValue
  isFocused: boolean
  setIsFocused: (isFocused: boolean) => void
  disabled: boolean
  rowHeight: number
}

/**
 * Higher-order component to render each field type’s cell components.
 * Handles when to render read-only `DisplayCell` and `EditorCell`.
 *
 * - Renders inline `EditorCell` after a timeout to improve scroll performance
 * - Handles popovers
 * - Renders Suspense for lazy-loaded `EditorCell`
 * - Provides a `tabIndex` prop, so that interactive cell children (like
 *   buttons) cannot be interacted with unless the user has focused in the
 *   cell. Required for accessibility.
 *
 * @param DisplayCellComponent
 * - The lighter cell component to display values. Also displayed when the
 *   column is disabled/read-only.
 *
 *   - Keep these components lightweight, i.e. use base HTML or simple MUI
 *     components. Avoid `Tooltip`, which is heavy.
 *   - Avoid displaying disabled states (e.g. do not reduce opacity/grey out
 *     toggles). This improves the experience of read-only tables for non-admins
 *   - ⚠️ Make sure the disabled state does not render the buttons to open a
 *       popover `EditorCell` (like Single/Multi Select).
 *   - ⚠️ Make sure to use the `tabIndex` prop for buttons and other interactive
 *       elements.
 *   - {@link IDisplayCellProps}
 *
 * @param EditorCellComponent
 * - The heavier cell component to edit values
 *
 *   - `EditorCell` should use the `value` and `onChange` props for the
 *     rendered inputs. Avoid creating another local state here.
 *   - You can pass `null` to `withRenderTableCell()` to always display the
 *     `DisplayCell`.
 *   - ⚠️ If it’s displayed inline, you must call `onSubmit` to save the value
 *       to the database, because it never unmounts.
 *   - ✨ You can reuse your `SideDrawerField` as they take the same props. It
 *       should probably be displayed in a popover.
 *   - ⚠️ Make sure to use the `tabIndex` prop for buttons, text fields, and
 *       other interactive elements.
 *   - {@link IEditorCellProps}
 *
 * @param editorMode
 * - When to display the `EditorCell`
 * 1. **focus** (default): the user has focused on the cell by pressing Enter or
 *    double-clicking,
 * 2. **inline**: always displayed if the cell is editable, or
 * 3. **popover**: inside a popover when a user has focused on the cell
 *    (as above) or clicked a button rendered by `DisplayCell`
 *
 * @param options
 * - Note this is OK to pass as an object since it’s not defined in runtime
 * - {@link ICellOptions}
 */
export function withRenderTableCell(
  DisplayCellComponent: FunctionComponent<IDisplayCellProps>,
  EditorCellComponent: FunctionComponent<IEditorCellProps> | null,
  editorMode: 'focus' | 'inline' | 'popover' = 'focus',
  options: ICellOptions = {},
) {
  function RenderedTableCell({
    row: _row,
    cell,
    column,
    value,
    isFocused,
    setIsFocused,
    disabled,
    rowHeight,
  }: IRenderedTableCellProps) {
    const { setDirtyField, clearDirtyField, displayValue } = useTableStore(
      ({ dirtyFields, setDirtyField, clearDirtyField }) => ({
        setDirtyField,
        clearDirtyField,
        displayValue: cell.id in dirtyFields ? dirtyFields[cell.id] : value,
      }),
    )

    const [isPopoverOpen, setIsPopverOpen] = useState(false)
    const {
      x,
      y,
      strategy: popoverPos,
      refs: popoverRefs,
    } = useFloating({
      open: isPopoverOpen,
      onOpenChange: setIsPopverOpen,
      placement: 'bottom',
    })

    const containerRef = useRef<HTMLElement | null>(null)

    // Render inline editor cell after timeout on mount
    // to improve scroll performance
    const [inlineEditorReady, setInlineEditorReady] = useState(false)
    useEffect(() => {
      if (editorMode === 'inline') setTimeout(() => setInlineEditorReady(true))
    }, [])

    // Declare basicCell here so props can be reused by HeavyCellComponent
    const basicCellProps = {
      id: cell.id,
      value: displayValue,
      name: column.columnDef.meta!.name,
      type: column.columnDef.meta!.type,
      // row: row.original,
      column: column.columnDef.meta!,
      // _rowy_ref: row.original._rowy_ref,
      disabled,
      tabIndex: isFocused ? 0 : -1,
      openPopover: () => setIsPopverOpen(true),
      closePopover: () => setIsPopverOpen(false),
      setIsFocused,
      rowHeight,
    }

    // Show display cell, unless if editorMode is inline
    const displayCell = (
      <div
        ref={(el) => {
          if (el) containerRef.current = el.parentElement
        }}
        class="overflow-x-clip"
        style={options.disablePadding ? { padding: 0 } : undefined}
      >
        <DisplayCellComponent {...basicCellProps} />
      </div>
    )

    // Show displayCell as a fallback if intentionally null
    const editorCell = EditorCellComponent ? (
      <Suspense fallback={null}>
        <EditorCellComponent
          {...basicCellProps}
          parentRef={(el) => (containerRef.current = el)}
          onChange={(value) => setDirtyField(cell.id, value)}
          onReset={() => clearDirtyField(cell.id)}
        />
      </Suspense>
    ) : (
      displayCell
    )

    if (disabled || (editorMode !== 'inline' && !isFocused)) {
      return displayCell
    } else if (editorMode === 'inline' && !inlineEditorReady) {
      // If the inline editor cell is not ready to be rendered, display nothing
      return null
    } else if (editorMode === 'focus' && isFocused) {
      return editorCell
    } else if (editorMode === 'inline') {
      return (
        <div
          class="cell-contents"
          style={options.disablePadding ? { padding: 0 } : undefined}
          ref={(el) => {
            if (el) containerRef.current = el.parentElement
          }}
        >
          {editorCell}
        </div>
      )
    } else if (editorMode === 'popover') {
      return (
        <>
          {displayCell}
          <div
            ref={popoverRefs.setFloating}
            style={{
              position: popoverPos,
              top: y ?? 0,
              left: x ?? 0,
              width: 'max-content',
            }}
          >
            {editorCell}
          </div>
        </>
      )
    }

    throw new Error('Invalid editor state!')
  }

  return memo(
    RenderedTableCell,
    // Memo function
    (prev, next) => {
      const valueEqual = equals(prev.value, next.value)
      const columnEqual = equals(prev.column.columnDef.meta, next.column.columnDef.meta)
      const rowEqual = equals(prev.row.original, next.row.original)
      const focusInsideCellEqual = prev.isFocused === next.isFocused
      const disabledEqual = prev.disabled === next.disabled

      const baseEqualities = valueEqual && columnEqual && focusInsideCellEqual && disabledEqual

      if (options?.usesRowData) return baseEqualities && rowEqual
      else return baseEqualities
    },
  )
}
