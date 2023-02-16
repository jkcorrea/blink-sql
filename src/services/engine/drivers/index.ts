import { ConnectionConfig } from '~/services/engine/drivers/connection-config'

import { runner } from '../runner'
import type { BaseDriver } from './base-driver'
import { PostgresDriver } from './postgres'

const drivers = {
  POSTGRES: PostgresDriver,
  MYSQL: null,
  MSSQL: null,
  SQLITE: null,
} as const

// NOTE memoizing this function so we're not re-creating the driver every time. not sure
// if this is needed or even the best way to share global state, but it'll do for now!
const cache = new Map<string, InstanceType<typeof BaseDriver>>()

export const getDriver = (databaseUrl: string): InstanceType<typeof BaseDriver> => {
  let driver = cache.get(databaseUrl)

  if (!driver) {
    console.debug('Creating new driver for db', databaseUrl)
    const conn = ConnectionConfig.fromDatabaseUrl(databaseUrl)
    const Driver = drivers[conn.type]
    if (!Driver) throw new Error(`Introspection not supported for ${conn.type}`)

    driver = new Driver(conn, runner)
    cache.set(databaseUrl, driver)
  }

  return driver
}
