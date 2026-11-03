import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css'
import '@/stores/temaStore.ts';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster position="top-right" toastOptions={{ className: 'dark:bg-slate-800! dark:text-slate-100!' }}/>
    </BrowserRouter>
  </StrictMode>,
)
