import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import './styles/theme.css'
import App from './App.tsx'
import { AccessibilityProvider } from './contexts/accessibility/AccessibilityContext.tsx'
import { AuthProvider } from './contexts/auth/AuthContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AccessibilityProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </AccessibilityProvider>
    </BrowserRouter>
  </StrictMode>,
)
