import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

// Add window.ethereum type declaration
declare global {
  interface Window {
    ethereum?: any;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
