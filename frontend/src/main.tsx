import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ThemeProvider } from './hooks/useTheme';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
