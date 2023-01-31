/* @refresh reload */
import { invoke } from '@tauri-apps/api'
import { ErrorBoundary, resetErrorBoundaries, Suspense } from 'solid-js'

import { AppRouter } from './router'

export const App = () => {
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
