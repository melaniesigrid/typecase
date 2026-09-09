import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { injectFontFaces } from './fontfaces.js';
import App from './App.jsx';
import './styles.css';
import './styles-lookbook.css';
import './styles-library.css';

injectFontFaces();
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
