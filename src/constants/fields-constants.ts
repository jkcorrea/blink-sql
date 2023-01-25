// Define field type strings used in column config
export enum FieldType {
  // METADATA
  ID = 'ID',
  // Strings
  TEXT = 'TEXT',
  LONG_TEXT = 'LONG_TEXT',
  RICH_TEXT = 'RICH_TEXT',
  EMAIL = 'EMAIL',
  PHONE = 'PHONE_NUMBER',
  URL = 'URL',
  // Enum
  SELECT = 'SELECT',
  // Booleans
  BOOLEAN = 'BOOLEAN',
  CHECKBOX = 'CHECK_BOX',
  // Numbers
  NUMBER = 'NUMBER',
  GEO_POINT = 'GEO_POINT',
  // Date & time
  DATE = 'DATE',
  DATE_TIME = 'DATE_TIME',
  CREATED_AT = 'CREATED_AT',
  UPDATED_AT = 'UPDATED_AT',
  // FILE
  IMAGE = 'IMAGE',
  FILE = 'FILE',
  // CODE
  JSON = 'JSON',
  CODE = 'CODE',
  MARKDOWN = 'MARKDOWN',
}
