import { ContextProviderProps, createContextProvider } from '@solid-primitives/context'
import { batch, createComputed, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'

import { executeSql } from './utils/execute-sql'
import { parseDatabaseUrl } from './utils/parse-db-url'
import introspect from './introspect'
import { Table, ValidDatabaseTypes } from './types'

interface DatabaseState {
  databaseUrl: string
  driver: ValidDatabaseTypes
  tables: Record<string, Table>
}

interface DatabaseActions {
  syncTables: () => Promise<void>
}

interface Props extends ContextProviderProps {
  databaseUrl: string
}

const createDatabaseStore = (props: Props) => {
  const [state, setState] = createStore<DatabaseState | Record<string, never>>({})

  createComputed(() => {
    const { driver } = parseDatabaseUrl(props.databaseUrl)
    batch(() => {
      setState('databaseUrl', props.databaseUrl)
      setState('driver', driver)
    })
  })

  const exec = (sql: string) => executeSql(sql, props.databaseUrl)

  const actions: DatabaseActions = {
    syncTables: async () => {
      const introspectFn = introspect[state.driver]
      const tables = await introspectFn(exec)
      setState('tables', tables)
    },
  }

  onMount(() => {
    actions.syncTables()
  })

  const value = $([state, actions] as const)
  return value
}

const [DatabaseProvider, _useDatabase] = createContextProvider(createDatabaseStore)
const useDatabase = () => _useDatabase()!
export { DatabaseProvider, useDatabase }

// Get all tables for schema
// SELECT table_name FROM information_schema.tables WHERE table_schema = '${schema}' ORDER BY table_name;

// Get all enums for schema
// SELECT t.typname as name, concat('"', string_agg(e.enumlabel, '","'), '"') AS value
//         FROM pg_type t
//         JOIN pg_enum e on t.oid = e.enumtypid
//         JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
//         WHERE n.nspname = ${schema}
//         GROUP BY name;

// Get all columns for table
// SELECT column_name, data_type, udt_name, ordinal_position, column_default, is_generated, is_nullable, is_updatable
//         FROM information_schema.columns
//         WHERE table_name = 'thing'
//         ORDER BY ordinal_position;
