import type { ConnectionConfig } from '~/utils/connection-config'

import { runner } from '../runner'
import type { BaseDriver } from './base'
import { PostgresDriver } from './postgres'

const drivers = {
  POSTGRES: PostgresDriver,
  MYSQL: null,
  MSSQL: null,
  SQLITE3: null,
} as const

// NOTE memoizing this function so we're not re-creating the driver every time. not sure
// if this is needed or even the best way to share global state, but it'll do for now!
const cache = new WeakMap<ConnectionConfig, InstanceType<typeof BaseDriver>>()

export const getDriverForConnection = (conn: ConnectionConfig): InstanceType<typeof BaseDriver> => {
  let driver = cache.get(conn)

  if (!driver) {
    console.debug('Creating new driver for connection', conn)
    const Driver = drivers[conn.type]
    if (!Driver) throw new Error(`Introspection not supported for ${conn.type}`)

    driver = new Driver(conn.toString(), runner)
    cache.set(conn, driver)
  }

  return driver
}
