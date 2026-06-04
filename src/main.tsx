import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/theme-provider'
import { AuthProvider } from './context/AuthProvider'

import { Provider } from 'react-redux'
import { store } from './store'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Toaster position="top-right" richColors />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
