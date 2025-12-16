const fs = require('fs');
const path = require('path');

// 1. Detect where we are and find the "src" folder
let srcPath = path.join(process.cwd(), 'src');
if (!fs.existsSync(srcPath)) {
  // Try looking one level deeper if the user is in the root
  srcPath = path.join(process.cwd(), 'frontend', 'src');
}
if (!fs.existsSync(srcPath)) {
  console.error("❌ ERROR: Could not find the 'src' folder. Make sure you are in the project folder!");
  process.exit(1);
}

console.log(`📍 Targeting Source: ${srcPath}`);

// Helper to write files
const writeFile = (relPath, content) => {
  const fullPath = path.join(srcPath, relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Created: ${relPath}`);
};

// --- CONTENT TO WRITE ---

const homeContent = `import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../CartContext";

const Home = () => {
  const [products, setProducts] = useState([]);
  const { addToCart, addToWishlist } = useContext(CartContext) || {};

  useEffect(() => {
    fetch("https://floris-backend-ct26.onrender.com/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h1>Welcome to Floris Herbals</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px" }}>
        {products.map((p) => (
          <div key={p._id} style={{ border: "1px solid #eee", padding: "10px", borderRadius: "8px" }}>
            <img src={p.image} alt={p.name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>
            <button onClick={() => addToCart(p)} style={{ width: "100%", background: "#28a745", color: "#fff", border: "none", padding: "8px", marginBottom: "5px" }}>Add to Cart</button>
            <button onClick={() => addToWishlist(p)} style={{ width: "100%", background: "#ffc107", border: "none", padding: "8px" }}>❤️ Wishlist</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;`;

const wishlistContent = `import React, { useContext } from "react";
import { CartContext } from "../CartContext"; 

const Wishlist = () => {
  const { wishlist = [], removeFromWishlist, addToCart } = useContext(CartContext) || {};
  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>❤️ My Wishlist</h2>
      {wishlist.length === 0 ? <p>Your wishlist is empty.</p> : (
        <div style={{ display: "grid", gap: "10px" }}>
          {wishlist.map((item) => (
            <div key={item._id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4>{item.name}</h4>
              <div>
                <button onClick={() => addToCart(item)} style={{ marginRight: "10px", background: "#28a745", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Add to Cart</button>
                <button onClick={() => removeFromWishlist(item._id)} style={{ background: "#dc3545", color: "#fff", border: "none", padding: "5px 10px", borderRadius: "4px" }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Wishlist;`;

const navbarContent = `import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext"; 

const Navbar = () => {
  const { cart = [], wishlist = [] } = useContext(CartContext) || {};
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem("userInfo"); navigate("/login"); };

  const navStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "15px 30px", background: "#1a1a1a", color: "#fff", position: "sticky", top: 0, zIndex: 100 };
  const linkStyle = { color: "#fff", textDecoration: "none", marginLeft: "20px" };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ ...linkStyle, fontSize: "1.5rem", fontWeight: "bold", marginLeft: 0 }}>🌿 Floris Herbals</Link>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/category/pooja-oils" style={linkStyle}>Pooja Oils</Link>
        <Link to="/category/soap-fragrances" style={linkStyle}>Soap Fragrances</Link>
        <Link to="/category/raw-materials" style={linkStyle}>Raw Materials</Link>
        <Link to="/wishlist" style={linkStyle}>❤️ Wishlist ({wishlist.length})</Link>
        <Link to="/cart" style={linkStyle}>🛒 Cart ({cart.reduce((a,c)=>a+c.qty,0)})</Link>
        <button onClick={handleLogout} style={{ marginLeft: "20px", background: "transparent", border: "1px solid white", color: "white", padding: "5px", borderRadius: "5px" }}>Logout</button>
      </div>
    </nav>
  );
};
export default Navbar;`;

const simplePage = (title) => `import React from "react";
const ${title} = () => <div style={{padding: "20px"}}><h1>${title}</h1></div>;
export default ${title};`;

// --- EXECUTE ---
console.log("🚀 Starting Nuclear Repair...");

// 1. DELETE OLD PAGES FOLDER (To kill hidden bad files)
const pagesPath = path.join(srcPath, 'pages');
if (fs.existsSync(pagesPath)) {
  fs.rmSync(pagesPath, { recursive: true, force: true });
  console.log("🔥 Cleaned old 'pages' folder.");
}

// 2. DELETE OLD CONTEXT FOLDER (To stop Vercel confusion)
const badContextPath = path.join(srcPath, 'context');
if (fs.existsSync(badContextPath)) {
  fs.rmSync(badContextPath, { recursive: true, force: true });
  console.log("🔥 Removed conflicting 'context' folder.");
}

// 3. WRITE FRESH FILES
writeFile('pages/Home.js', homeContent);
writeFile('pages/Wishlist.js', wishlistContent);
writeFile('components/Navbar.js', navbarContent);

// 4. WRITE PLACEHOLDERS
writeFile('pages/Login.js', simplePage("Login"));
writeFile('pages/Register.js', simplePage("Register"));
writeFile('pages/AdminDashboard.js', simplePage("AdminDashboard"));

console.log("🏁 Repair Complete. Push now!");
