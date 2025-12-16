const fs = require('fs');
const path = require('path');

// Function to recursively get all files in a directory
const getAllFiles = (dirPath, arrayOfFiles) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach((file) => {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

// Main logic
try {
  const srcDir = path.join(process.cwd(), 'frontend', 'src');
  const allFiles = getAllFiles(srcDir);

  console.log(`🔍 Scanning ${allFiles.length} files for broken imports...`);

  allFiles.forEach((file) => {
    if (file.endsWith('.js')) {
      let content = fs.readFileSync(file, 'utf8');
      
      // THE FIX: Replace 'context/CartContext' with 'CartContext'
      // This handles "../context/CartContext" -> "../CartContext"
      if (content.includes('context/CartContext')) {
        console.log(`⚠️ Found broken import in: ${path.basename(file)}`);
        
        // Replace the bad path with the new correct path
        const newContent = content.replace(/context\/CartContext/g, 'CartContext');
        
        fs.writeFileSync(file, newContent);
        console.log(`✅ Fixed: ${path.basename(file)}`);
      }
    }
  });
  
  console.log("🏁 Scan complete. All bad imports destroyed.");

} catch (e) {
  console.log("Error:", e.message);
  // Fallback: If run inside frontend folder directly
  try {
      const srcDir = path.join(process.cwd(), 'src');
      // ... (Same logic would apply, but let's keep it simple for the user)
      console.log("Try running this from the root folder if it failed.");
  } catch (err) {}
}
