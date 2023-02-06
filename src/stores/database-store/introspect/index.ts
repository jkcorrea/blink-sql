import { IntrospectionFn, ValidDatabaseTypes } from '../types'
import { introspect as postgres } from './postgres'

const introspects: Record<ValidDatabaseTypes, IntrospectionFn> = {
  postgres,
  mysql: () => Promise.reject(new Error('MySQL not supported yet')),
  mssql: () => Promise.reject(new Error('MSSQL not supported yet')),
  sqlite3: () => Promise.reject(new Error('SQLite not supported yet')),
}

export default introspects
