// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from './router.jsx'
import { AuthProvider  } from './contexts/authContext.jsx'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AlertProvider } from './contexts/alertContext.jsx'

const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  // <StrictMode>

    <QueryClientProvider client={queryClient}>
    <AuthProvider >
    <AlertProvider>
    <RouterProvider router={router} />
    </AlertProvider>
    </AuthProvider >
    </QueryClientProvider>

  // </StrictMode>,
)
