const fs = require('fs');
const path = require('path');

// Target: frontend/src/index.js
const dirPath = path.join('frontend', 'src');
const filePath = path.join(dirPath, 'index.js');

// Ensure directory exists
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// The standard React entry code
const content = `import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);`;

fs.writeFileSync(filePath, content);
console.log("✅ Success: Created frontend/src/index.js");
