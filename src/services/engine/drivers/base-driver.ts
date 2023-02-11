import type { SqlDriverType } from '~/constants'
import { ConnectionConfig } from '~/services/engine/drivers/connection-config'
import type { Column, Table } from '~/types/project'

import type { RunnerFn } from '../runner'

/** A database driver manages connecting to & executing queries against a specific database. */
export abstract class BaseDriver {
  /** The type of SQL database this driver is for. */
  abstract readonly type: SqlDriverType

  /** An object containing info on how to connect to the database. */
  readonly connection: ConnectionConfig

  /** A special function that can execute SQL queries safely against the database. */
  protected readonly exec: <T>(sql: string) => Promise<T>

  /**
   * @param databaseUrl The database URL to connect to.
   * @param runner A function that can execute SQL queries against the database.
   */
  constructor(databaseUrl: string | URL | ConnectionConfig, runner: RunnerFn) {
    this.connection =
      databaseUrl instanceof ConnectionConfig ? databaseUrl : ConnectionConfig.fromDatabaseUrl(databaseUrl)
    this.exec = (sql) => runner(sql, databaseUrl.toString())
  }

  /** Retrieves the tables according to `information_schema`. */
  abstract getTables(): Promise<Table[]>

  /**
   * Retrieves columns for a table according to `information_schema`.
   *
   * @param tableId The ID of the table to introspect. This is the `table_name` from `information_schema`. For Postgres, this is `schema.table`, since Postgres supports multiple schemas.
   */
  abstract getColumns(tableId: string): Promise<Column[]>

  /**
   * Retrieves data from a table.
   */
  abstract select<TData = unknown>(tableId: string, params?: SelectParams): Promise<TData[]>
}

export interface SelectParams {
  columns?: string[]
  where?: string
  sort?: string
}
