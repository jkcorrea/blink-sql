import { createBrowserRouter } from 'react-router-dom'

import NotFound from './pages/404'
import ProjectIndex, { loader as rootLoader } from './pages/project'
import ProjectTable, { loader as projectTableLoader } from './pages/project/table'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProjectIndex />,
    loader: rootLoader,
    children: [
      {
        path: 't/:tableName',
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
