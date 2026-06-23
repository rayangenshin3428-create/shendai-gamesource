import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { GameProvider } from './state/game';
import { SettingsProvider } from './state/settings';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </SettingsProvider>
  </StrictMode>,
);
