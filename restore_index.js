const fs = require('fs');
const path = require('path');

// Define the path: frontend/public/index.html
const dirPath = path.join('frontend', 'public');
const filePath = path.join(dirPath, 'index.html');

// Ensure the folder exists
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// The content needed for the site to load
const content = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Floris Herbals</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

// Write the file
fs.writeFileSync(filePath, content);
console.log("✅ Success: Created frontend/public/index.html");
