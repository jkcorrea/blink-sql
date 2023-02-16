import { SqlDriverType } from '~/constants'

export type ConnectionQuery = Record<string, string | string[]>

export class ConnectionConfig {
  /** The SQL driver we should use for this db */
  type: SqlDriverType
  /** The original protocol supplied by the user/connection string */
  protocol: string
  /** For sqlite, this would be the filename/filepath. */
  database: string
  user?: string
  password?: string
  host?: string
  port?: string
  /** Optional query strings appended to the connection string */
  query?: ConnectionQuery
  /** The original database URL, if available */
  databaseUrl?: string

  constructor(config: ConnectionConfig) {
    this.type = config.type
    this.protocol = config.protocol
    this.user = config.user
    this.password = config.password
    this.host = config.host
    this.port = config.port
    this.database = config.database
    this.query = config.query
    this.databaseUrl = config.databaseUrl
  }

  static fromDatabaseUrl(databaseUrl: URL | string): ConnectionConfig {
    const parsedUrl = new URL(databaseUrl)
    const query = searchParamsToQuery(parsedUrl)
    const protocol = parsedUrl.protocol?.replace(/:$/, '')
    let type = protocol.toUpperCase()

    if (type === 'MYSQL2') type = SqlDriverType.MYSQL
    if (type === 'POSTGRESQL') type = SqlDriverType.POSTGRES
    if (type === 'SQLITE3') type = SqlDriverType.SQLITE
    if (!assertValidDriver(type)) throw new Error(`Invalid database protocol: ${protocol} in ${databaseUrl}`)

    let database = parsedUrl.pathname?.replace(/^\//, '').replace(/\/$/, '') ?? ''
    if (type === SqlDriverType.SQLITE) {
      // Assume it's a sqlite file
      database = parsedUrl.hostname
        ? // Relative or just a filename (no pathname)
          `${parsedUrl.hostname}${parsedUrl.pathname ?? ''}`
        : // Absolute
          parsedUrl.pathname ?? ''
    }

    return new ConnectionConfig({
      type,
      protocol,
      user: parsedUrl.username,
      password: parsedUrl.password,
      host: parsedUrl.hostname,
      port: parsedUrl.port,
      database,
      query,
      databaseUrl: parsedUrl.toString(),
    })
  }

  toString(): string {
    if (this.databaseUrl) return this.databaseUrl

    const url = new URL(`${this.protocol}://`)

    url.pathname = this.database
    if (this.user) url.username = this.user
    if (this.password) url.password = this.password
    if (this.host) url.hostname = this.host
    if (this.port) url.port = this.port

    queryToSearchParams(url, this.query ?? {})

    return url.toString()
  }
}

/** Modifies the passed in url in-place */
function queryToSearchParams(url: URL, query: ConnectionQuery): void {
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const val of value) {
        url.searchParams.append(key, val)
      }
    } else {
      url.searchParams.append(key, value)
    }
  }
}

function searchParamsToQuery(url: URL): ConnectionQuery {
  const query: ConnectionQuery = {}
  for (const [key, value] of url.searchParams.entries()) {
    const curr = query[key]
    if (curr) {
      query[key] = [...(typeof curr === 'string' ? [curr] : curr), value]
    }
    query[key] = value
  }
  return query
}

const assertValidDriver = (driver: string | undefined): driver is SqlDriverType =>
  Object.values<string>(SqlDriverType).includes(driver ?? '')
