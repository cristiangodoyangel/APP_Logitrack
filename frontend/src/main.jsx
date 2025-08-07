import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { Dashboard } from './components/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="container-fluid py-4">
      <Dashboard />
    </div>
  </StrictMode>,
);
