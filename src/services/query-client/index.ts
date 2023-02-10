import { mergeQueryKeys } from '@lukemorales/query-key-factory'
import { QueryClient } from '@tanstack/react-query'

import { projectQueries } from './project'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // We should only refetch when explicitly runs a query
      refetchOnWindowFocus: false,
      // Alert user of errors & let them decide what to do
      retry: false,
    },
  },
})

export const Q = mergeQueryKeys(projectQueries)
