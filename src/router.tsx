import { Route, Routes } from '@solidjs/router'
import { lazy } from 'solid-js'

export const AppRouter = () => (
  <Routes>
    <Route path="/" component={lazy(() => import('./pages/Home'))} />
    <Route path="/*" component={lazy(() => import('./pages/404'))} />
  </Routes>
)
