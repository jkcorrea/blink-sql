import { QueryClientProvider } from '@tanstack/react-query'
import { render } from 'preact'
import { Suspense } from 'preact/compat'
import { RouterProvider } from 'react-router-dom'

import { queryClient } from './services/query-client'
import type { FallbackRender } from './utils/ErrorBoundary'
import { ErrorBoundary } from './utils/ErrorBoundary'
import { router } from './router'

import './index.css'

function App() {
  // useEffect(() => {
  //   invoke('app_ready')
  // }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback="Loading...">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </Suspense>
    </QueryClientProvider>
  )
}

const ErrorFallback: FallbackRender = ({ error, resetErrorBoundary }) => (
  <div
    data-tauri-drag-region
    role="alert"
    className="border-app-divider bg-app flex h-screen w-screen flex-col items-center justify-center rounded-lg border p-4"
  >
    <p className="text-ink-faint m-3 text-sm font-bold">APP CRASHED</p>
    <h1 className="text-ink text-2xl font-bold">Click below to reload the app</h1>
    <pre className="text-ink m-2">Error: {error.message}</pre>
    <div className="text-ink flex flex-row space-x-2">
      <button className="btn btn-accent mt-2" /* onClick={resetErrorBoundary} */>Reload</button>
      <button className="btn btn-secondary mt-2" onClick={resetErrorBoundary}>
        Send report
      </button>
    </div>
  </div>
)

// NOTE: Workaround for a strange Vite hot-reloading bug
// see: https://github.com/vitejs/vite/issues/7839#issuecomment-1340109679
if (import.meta.hot) {
  const onBeforeViteUpdate = (event: any) => {
    if (event.type !== 'update') return
    // Patch `event.updates` to remove the version query parameter from path,
    // so that the update gets picked up.
    // NOTE Why the stored `deps` are missing this part of the URL, I cannot say…
    const updates = []
    for (const update of event.updates) {
      updates.push(update, {
        ...update,
        acceptedPath: update.acceptedPath.replace(/\?v=[0-9a-f]+&/i, '?'),
      })
    }
    event.updates = updates
  }
  import.meta.hot.on('vite:beforeUpdate', onBeforeViteUpdate)
}

render(<App />, document.getElementById('root') as HTMLElement)
