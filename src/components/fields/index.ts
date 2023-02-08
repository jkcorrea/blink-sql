import { find, prop, propEq } from 'rambda'

import type { FieldType } from '~/lib/constants'
import type { Column } from '~/types/project'

// Import field configs
import Text from './Text'
// // import Aggregate from "./Aggregate";
import type { IFieldConfig } from './types'

// Export field configs in order for FieldsDropdown
export const FIELDS: IFieldConfig[] = [
  /** TEXT */
  Text,
  // LongText,
  // RichText,
  // Email,
  // Phone,
  // Url,
  // /** SELECT */
  // SingleSelect,
  // MultiSelect,
  // /** NUMERIC */
  // Number_,
  // Checkbox,
  // Percentage,
  // Rating,
  // Slider,
  // Color,
  // GeoPoint,
  // /** DATE & TIME */
  // Date_,
  // DateTime,
  // Duration,
  // /** FILE */
  // Image_,
  // File_,
  // /** CONNECTION */
  // Connector,
  // SubTable,
  // Reference,
  // ConnectTable,
  // ConnectService,
  // /** CODE */
  // Json,
  // Code,
  // Markdown,
  // /** CLOUD FUNCTION */
  // Action,
  // Derivative,
  // // // Aggregate,
  // Status,
  // /** AUDITING */
  // CreatedBy,
  // UpdatedBy,
  // CreatedAt,
  // UpdatedAt,
  // /** METADATA */
  // User,
  // Id,
]

/**
 * Returns specific property of field config
 * @param prop - The field config prop to retrieve
 * @param fieldType - The field type to get the config from
 * @returns The field config prop value
 */
export const getFieldProp = (key: keyof IFieldConfig, fieldType: FieldType) => {
  const field = find(propEq('type', fieldType), FIELDS)
  return prop(key, field) as IFieldConfig[keyof IFieldConfig]
}

/**
 * Returns `true` if it receives an existing fieldType
 * @param fieldType - The field type to check
 * @returns boolean
 */
export const isFieldType = (fieldType: any) => {
  const fieldTypes = FIELDS.map((field) => field.type)
  return fieldTypes.includes(fieldType)
}

/**
 * Returns array of fieldTypes with dataType included dataTypes array
 * @param dataTypes - The dataTypes to check
 * @returns array of fieldTypes
 */
export const hasDataTypes = (dataTypes: string[]) => {
  const fieldTypes = FIELDS.map((field) => field.type)
  return fieldTypes.filter((fieldType) => dataTypes.includes(getFieldProp('dataType', fieldType)))
}

/**
 * Returns the FieldType of a config. Used for Derivative fields.
 * @param column - The column to check
 * @returns FieldType
 */
export const getFieldType = (column: Pick<Column, 'type' | 'userConfig'> & Partial<Column>) =>
  column.userConfig?.displayType || column.type
// TODO derivative?
// column.type === FieldType.derivative ? column.config?.renderFieldType : column.type
