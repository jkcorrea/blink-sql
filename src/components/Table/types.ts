import type { FieldType } from '~/lib/constants'

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

/** Table schema document loaded when table or table settings dialog is open */
export type TableSchema = {
  columns?: Record<string, ColumnConfig>
  rowHeight?: number
  // filters?: TableFilter[]
  // filtersOverridable?: boolean

  functionConfigPath?: string
  functionBuilderRef?: any

  // extensionObjects?: IExtension[]
  compiledExtension?: string
  // webhooks?: IWebhook[]
  // runtimeOptions?: IRuntimeOptions

  /** @deprecated Migrate to Extensions */
  sparks?: string
}

export type ColumnConfig = {
  /** Unique id for this column */
  id: string
  index: number
  type: FieldType
  /** Field key/name stored in document */
  fieldName: string
  /** User-facing name */
  name: string
  width?: number
  isReadonly?: boolean
  isHidden?: boolean
  isPinned?: boolean
  isResizable?: boolean

  config?: Partial<{
    /** Set column to required */
    required: boolean
    /** Set column default value */
    defaultValue: {
      type: 'undefined' | 'null' | 'static' | 'dynamic'
      value?: any
      script?: string
      dynamicValueFn?: string
    }
    /** Regex used in CellValidation */
    validationRegex: string
    /** FieldType to render for Derivative fields */
    renderFieldType?: FieldType
    /** Used in Derivative fields */
    listenerFields?: string[]
    /** Used in Derivative and Action fields */
    requiredFields?: string[]
    /** For sub-table fields */
    parentLabel: string[]

    primaryKeys: string[]

    /** Column-specific config */
    [key: string]: any
  }>
}
