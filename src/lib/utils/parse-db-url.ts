import type { ValidDatabaseTypes } from '~/types/project'

import { VALID_DATABASE_TYPES } from '../constants'

export interface BaseConnectionConfig {
  driver: Exclude<ValidDatabaseTypes, 'sqlite3'>
  user?: string
  password?: string
  host: string
  port: string
  database: string
  query?: Record<string, string | string[]>
}

export interface SqliteConnectionConfig {
  driver: 'sqlite3'
  filename: string
  query?: Record<string, string | string[]>
}

export type ConnectionConfig = BaseConnectionConfig | SqliteConnectionConfig

const assertValidDriver = (driver: string | undefined): driver is ValidDatabaseTypes =>
  VALID_DATABASE_TYPES.includes(driver as ValidDatabaseTypes)

export function parseDatabaseUrl(databaseUrl: string): ConnectionConfig {
  const parsedUrl = new URL(databaseUrl)
  const query: Record<string, string | string[]> = {}
  for (const [key, value] of parsedUrl.searchParams.entries()) {
    const curr = query[key]
    if (curr) {
      query[key] = [...(typeof curr === 'string' ? [curr] : curr), value]
    }
    query[key] = value
  }

  let parsedProtocol = parsedUrl.protocol?.replace(/:$/, '')
  if (parsedProtocol === 'mysql2') parsedProtocol = 'mysql'
  if (!assertValidDriver(parsedProtocol)) throw new Error(`Invalid database type: ${parsedProtocol} in ${databaseUrl}`)

  if (parsedProtocol === 'sqlite3') {
    // Assume it's a sqlite file
    const filename = parsedUrl.hostname
      ? // Relative or just a filename (no pathname)
        `${parsedUrl.hostname}${parsedUrl.pathname ?? ''}`
      : // Absolute
        parsedUrl.pathname ?? ''

    return {
      driver: 'sqlite3',
      filename,
      query,
    }
  }

  return {
    driver: parsedProtocol,
    user: parsedUrl.username,
    password: parsedUrl.password,
    host: parsedUrl.hostname ?? '',
    port: parsedUrl.port ?? '',
    database: parsedUrl.pathname?.replace(/^\//, '').replace(/\/$/, '') ?? '',
    query,
  }
}
