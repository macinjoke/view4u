import { createBrowserRouter } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorPage from './pages/ErrorPage'
import Home from './pages/Home'
import Login from './pages/Login'
import Settings from './pages/Settings'
import Timeline from './pages/Timeline'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'timeline',
        element: <Timeline />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
    ],
  },
])
