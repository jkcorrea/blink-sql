import { JSX, ParentComponent } from 'solid-js'

import { FieldType } from '~/constants'

import { IContextMenuItem } from '../Table/ContextMenu/ContextMenuItem'
import { IRenderedTableCellProps } from '../Table/TableCell/withRenderTableCell'
import type { ColumnConfig, SelectedCell } from '../Table'

export { FieldType }

export interface IFieldConfig {
  type: FieldType
  name: string
  group: string
  dataType: string
  initializable?: boolean
  requireConfiguration?: boolean
  initialValue: any
  icon?: JSX.Element
  description?: string
  setupGuideLink?: string
  contextMenuActions?: (selectedCell: SelectedCell, reset: () => void) => IContextMenuItem[]
  TableCell: ParentComponent<IRenderedTableCellProps>
  SideDrawerField: ParentComponent<ISideDrawerFieldProps>
  // settings?: React.ComponentType<ISettingsProps>
  // settingsValidator?: (config: Record<string, any>) => Record<string, string>
  // filter?: {
  //   operators: IFilterOperator[]
  //   customInput?: React.ComponentType<IFilterCustomInputProps>
  //   defaultValue?: any
  //   valueFormatter?: (value: any, operator: TableFilter['operator']) => string
  // }
  // sortKey?: string
  // csvExportFormatter?: (value: any, config?: any) => string
  // csvImportParser?: (value: string, config?: any) => any
}

/** See {@link IRenderedTableCellProps | `withRenderTableCell` } for guidance */
export interface IDisplayCellProps<T = any> {
  id: string
  value: T
  type: FieldType
  name: string
  // row: TableRow
  column: ColumnConfig
  /** The row’s _rowy_ref object */
  // _rowy_ref: TableRowRef
  disabled: boolean
  /**
   * ⚠️ Make sure to use the `tabIndex` prop for buttons and other interactive
   *   elements.
   */
  tabIndex: number
  openPopover: () => void
  closePopover: () => void
  setIsFocused: (isFocused: boolean) => void
  rowHeight: number
}
/** See {@link IRenderedTableCellProps | `withRenderTableCell` } for guidance */
export interface IEditorCellProps<T = any> extends IDisplayCellProps<T> {
  /** Update the field's dirty value */
  onChange: (value: T) => void
  /** Resets a dirty field back to its original value */
  onReset: () => void
  /** Get parent element for popover positioning */
  parentRef: null | HTMLElement | ((element: HTMLElement) => HTMLElement)
}

/** Props to be passed to all SideDrawerFields */
export interface ISideDrawerFieldProps<T = any> {
  /** The column config */
  column: ColumnConfig
  /** The field’s local value – synced with db when field is not dirty */
  value: T
  /** Call when the user has input but changes have not been saved */
  onDirty: (dirty?: boolean) => void
  /** Update the local value. Also calls onDirty */
  onChange: (T: any) => void
  /** Call when user input is ready to be saved (e.g. onBlur) */
  onSubmit: () => void
  /** Field locked. Do NOT check `column.locked` */
  disabled: boolean
}

export interface ISettingsProps {
  onChange: (key: string) => (value: any) => void
  config: Record<string, any>
  fieldName: string
  onBlur: JSX.EventHandlerUnion<HTMLInputElement | HTMLTextAreaElement, FocusEvent>
  errors: Record<string, any>
}

// export interface IFilterOperator {
//   value: TableFilter['operator']
//   label: string
//   secondaryLabel?: React.ReactNode
//   group?: string
// }

// export interface IFilterCustomInputProps {
//   onChange: (value: any) => void
//   operator: TableFilter['operator']
//   [key: string]: any
// }
