import type { SqlDriverType } from '~/constants'
import type { Column, Table } from '~/types/project'

import type { RunnerFn } from '../runner'

export abstract class BaseDriver {
  abstract type: SqlDriverType

  protected exec: <T>(sql: string) => Promise<T>

  constructor(databaseUrl: string, runner: RunnerFn) {
    this.exec = (sql) => runner(sql, databaseUrl)
  }

  abstract introspectTables(): Promise<Table[]>
  abstract introspectColumns(tableId: string): Promise<Column[]>
}
