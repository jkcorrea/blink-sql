import { SqlDriverType } from '~/constants'
import type { Column, Table } from '~/types/project'

import type { SelectParams } from '../base-driver'
import { BaseDriver } from '../base-driver'
import { COLUMNS_INTROSPECTION_QUERY, ColumnsResultSchema, toColumn } from './columns'
import { TABLES_INTROSPECTION_QUERY, TablesResultSchema, toTable } from './tables'

export class PostgresDriver extends BaseDriver {
  type = SqlDriverType.POSTGRES

  async getTables(): Promise<Table[]> {
    const res = await this.exec(TABLES_INTROSPECTION_QUERY)
    return TablesResultSchema.parse(res).map(toTable)
  }

  async getColumns(tableId: string): Promise<Column[]> {
    const res = await this.exec(COLUMNS_INTROSPECTION_QUERY(tableId))
    return ColumnsResultSchema.parse(res).map(toColumn)
  }

  async select<TData = unknown>(tableId: string, params?: SelectParams): Promise<TData[]> {
    const { columns, where, sort } = params ?? {}
    const sql = /* sql */ `
      SELECT ${columns ? columns.join(', ') : '*'}
      FROM ${tableId}
      ${where ? `WHERE ${where}` : ''}
      ${sort ? `ORDER BY ${sort}` : ''}
    `
    return this.exec(sql)
  }
}
