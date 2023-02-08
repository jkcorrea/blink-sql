import { useQuery } from '@tanstack/react-query'
import { createContext } from 'preact'
import type { PropsWithChildren } from 'preact/compat'
import { useContext, useEffect, useRef } from 'preact/hooks'
import { createStore, useStore } from 'zustand'

import introspect from '~/lib/introspect'
import { executeSql } from '~/lib/utils/execute-sql'
import { parseDatabaseUrl } from '~/lib/utils/parse-db-url'
import type { Table } from '~/types/project'

type ExecSqlFn = <T = unknown>(sql: string) => Promise<T>

interface ProjectState {
  tables: Record<string, Table>
  exec: ExecSqlFn
  isLoading: boolean
}

const createProjectStore = (exec: ExecSqlFn) =>
  createStore<ProjectState>((_set, _get) => ({
    tables: {},
    isLoading: false,
    exec,
  }))

type ProjectStore = ReturnType<typeof createProjectStore>

const Context = createContext<ProjectStore | null>(null)

interface Props extends PropsWithChildren {
  databaseUrl: string
}

export const ProjectProvider = ({ children, databaseUrl }: Props) => {
  const storeRef = useRef<ProjectStore>()
  const exec: ExecSqlFn = (sql) => executeSql(sql, databaseUrl)
  const { driver } = parseDatabaseUrl(databaseUrl)

  const { data: tables = {}, isLoading } = useQuery(['project', databaseUrl, 'introspect'], () =>
    introspect[driver](exec),
  )

  useEffect(() => {
    storeRef.current?.setState((state) => ({
      ...state,
      tables,
      isLoading,
    }))
  }, [tables, isLoading])

  if (!storeRef.current) storeRef.current = createProjectStore(exec)

  return <Context.Provider value={storeRef.current}>{children}</Context.Provider>
}

export function useProjectStore<U>(selector: (state: ProjectState) => U, equalityFn?: (a: U, b: U) => boolean): U {
  const store = useContext(Context)
  if (!store) {
    throw new Error('useTableStore must be used within a TableStoreProvider')
  }

  return useStore(store, selector, equalityFn)
}
