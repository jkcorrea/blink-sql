import type { FieldType } from '~/constants'
import type { ConnectionConfig } from '~/services/engine/connection-config'

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

/** Preferences the user may set on a particular column. */
export interface ColumnPreferences {
  /** User-overridden name for the column. */
  friendlyName?: string
  /** User-overridden width for the column. */
  width?: number
  /** The user can choose to hide certain columns. */
  isHidden?: boolean
  /** The ID column is always pinned, but others can be as well. Pinned columns should be sorted by index. */
  isPinned?: boolean
  isResizable?: boolean
  /** The user can set a different way to render the field */
  displayType?: FieldType
}

/** Represents the bare minimum metadata we need to render a column */
export interface Column {
  /** A unique (within the table at least) ID for this column. Could be just the column name. */
  id: string
  /** Postgres has the concept of "schemas", we're just mapping it to a less confusing name */
  table?: string
  /** Postgres has the concept of "schemas", we're just mapping it to a less confusing name */
  schema?: string
  /** The order which this column appears in according to the db (e.g. ordinal_position) */
  index: number
  /** OUR field type, not the DB type */
  type: FieldType
  /** The actual name of the column, used to lookup data in each row */
  name: string
  /** Is the column writable at the db-level? */
  isReadonly?: boolean
  /** Is the column nullable at the db-level? */
  isNullable?: boolean
  /** User-supplied configuration */
  userConfig?: Partial<ColumnPreferences>
}

export interface Table {
  id: string
  name: string
  /** Postgres has the concept of "schemas", we're just mapping it to a less confusing name */
  schema?: string
}

export interface Project {
  id: string
  name: string
  connection: ConnectionConfig
}
