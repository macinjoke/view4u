import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import ErrorPage from './components/pages/ErrorPage'
import Home from './components/pages/Home'
import Login from './components/pages/Login'
import Settings from './components/pages/Settings'
import Timeline from './components/pages/Timeline'

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
