import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { router } from './router.tsx'

const reactRootDiv = document.getElementById('root')
if (!reactRootDiv) {
  throw new Error(
    'root element not found. Please ensure there is a <div id="root"></div> in your index.html.',
  )
}

ReactDOM.createRoot(reactRootDiv).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
