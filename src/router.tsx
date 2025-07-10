import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorPage from './components/pages/error/ErrorPage'
import Home from './components/pages/home/Home'
import Login from './components/pages/login/Login'
import Settings from './components/pages/settings/Settings'
import Timeline from './components/pages/timeline/Timeline'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'timeline',
        element: (
          <ProtectedRoute>
            <Timeline />
          </ProtectedRoute>
        ),
      },
      {
        path: 'settings',
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
])
