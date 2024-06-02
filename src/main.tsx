import './stylesheets/fonts.css'
import './stylesheets/index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import Home from './pages/Home.tsx'

const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: '/',
        element: <Navigate to='/browse' replace />,
      },
      {
        path: '/browse',
        element: <Home />,
      },
    ]
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
