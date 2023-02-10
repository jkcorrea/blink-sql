// A "runner" is a function that takes arbitrary SQL and an end-users's database URL, and
// executes the SQL against the database. It returns the results of the SQL query.
//
// Currently, we're using a usql binary, but eventually we may swap this out for a Tauri plugin or an RSPC/TRPC/REST API endpoint.

export { runner } from './usql'

export type RunnerFn = <T = unknown>(sql: string, dbUrl: string) => Promise<T>
