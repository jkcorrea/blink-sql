/* @refresh reload */
import { Router } from '@solidjs/router'
import { invoke } from '@tauri-apps/api'
import { ErrorBoundary, resetErrorBoundaries, Suspense } from 'solid-js'
import { render } from 'solid-js/web'

import { client, queryClient, rspc } from './lib/rspc'
import { DatabaseProvider } from './stores/database-store'
import { AppRouter } from './router'

import './index.css'

function App() {
  $mount(() => {
    invoke('app_ready')
  })

  return (
    <Suspense>
      <ErrorBoundary fallback={ErrorFallback}>
        <AppRouter />
      </ErrorBoundary>
    </Suspense>
  )
}

function Root() {
  return (
    <Router>
      <rspc.Provider client={client} queryClient={queryClient}>
        <DatabaseProvider databaseUrl="postgres://postgres:postgres@localhost:54322/postgres?sslmode=disable">
          <App />
        </DatabaseProvider>
      </rspc.Provider>
    </Router>
  )
}

const ErrorFallback = (error: Error) => {
  const onClick = () => {
    // captureException(error);
    resetErrorBoundaries()
  }

  return (
    <div
      data-tauri-drag-region
      role="alert"
      class="border-app-divider bg-app flex h-screen w-screen flex-col items-center justify-center rounded-lg border p-4"
    >
      <p class="text-ink-faint m-3 text-sm font-bold">APP CRASHED</p>
      <h1 class="text-ink text-2xl font-bold">We're past the event horizon...</h1>
      <pre class="text-ink m-2">Error: {error.message}</pre>
      <div class="text-ink flex flex-row space-x-2">
        <button class="btn btn-accent mt-2" /* onClick={resetErrorBoundary} */>Reload</button>
        <button class="btn btn-secondary mt-2" onClick={onClick}>
          Send report
        </button>
      </div>
    </div>
  )
}

render(() => <Root />, document.getElementById('root') as HTMLElement)
