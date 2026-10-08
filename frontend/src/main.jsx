import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { CurrencyProvider } from './contexts/CurrencyContext'
import { WalletProvider } from './contexts/WalletContext'
import './i18n'
import './index.css'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'

registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <CurrencyProvider>
        <WalletProvider>
          <App />
        </WalletProvider>
      </CurrencyProvider>
    </HelmetProvider>
  </StrictMode>,
)
