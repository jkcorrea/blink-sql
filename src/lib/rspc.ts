import { createClient } from '@rspc/client'
import { createSolidQueryHooks } from '@rspc/solid'
import { TauriTransport } from '@rspc/tauri'
import { QueryClient } from '@tanstack/solid-query'

import type { Procedures } from './rspc.d'

export const client = createClient<Procedures>({
  transport: new TauriTransport(),
})

export const queryClient = new QueryClient()

export const rspc = createSolidQueryHooks<Procedures>()
