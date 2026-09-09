import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { injectFontFaces } from './fontfaces.js';
import App from './App.jsx';
import './styles.css';

injectFontFaces();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
