import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import { router } from './routes/index.ts'
import { ThemeProvider } from './providers/theme-provider.tsx'
import { Provider } from 'react-redux'
import { store } from './redux/store.ts'






createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <Provider store={store}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    </Provider>
  </StrictMode>
)
