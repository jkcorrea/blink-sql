import { createBrowserRouter } from 'react-router-dom'

import NotFound from './pages/404'
import LauncherPage, { loader as launcherLoader } from './pages/launcher'
import ProjectIndex, { loader as projectLoader } from './pages/project'
import ProjectTable, { loader as projectTableLoader } from './pages/project/table'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LauncherPage />,
    loader: launcherLoader,
  },
  {
    path: '/p/:projectId',
    element: <ProjectIndex />,
    loader: projectLoader,
    children: [
      {
        path: 't/:tableId',
        element: <ProjectTable />,
        loader: projectTableLoader,
      },
    ],
  },
  {
    path: '/*',
    element: <NotFound />,
  },
])

// Clean & abort all pending requests on HMR
if (import.meta.hot) import.meta.hot.dispose(() => router.dispose())
