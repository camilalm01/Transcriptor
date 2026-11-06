import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import {queryClient} from "./lib/queryClient.ts";
import './index.css'
import './styles/theme.css'
import App from './App.tsx'
import { AccessibilityProvider } from './contexts/accessibility/AccessibilityContext.tsx'
import { AuthProvider } from './contexts/auth/AuthContext.tsx'
import { RecordingProvider } from './contexts/recording/RecordingContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
      <AccessibilityProvider>
        <AuthProvider>
          <RecordingProvider>
            <App />
          </RecordingProvider>
        </AuthProvider>
      </AccessibilityProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
