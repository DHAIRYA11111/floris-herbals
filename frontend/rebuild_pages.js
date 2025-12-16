const fs = require('fs');
const path = require('path');

const srcPath = path.join(process.cwd(), 'frontend', 'src');
const pagesPath = path.join(srcPath, 'pages');

// 1. DELETE the old pages folder (Scorched Earth)
if (fs.existsSync(pagesPath)) {
  fs.rmSync(pagesPath, { recursive: true, force: true });
  console.log("🔥 Destroyed old pages folder.");
}
fs.mkdirSync(pagesPath);

const writeFile = (relPath, content) => {
  const fullPath = path.join(srcPath, relPath);
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Created: ${relPath}`);
};

// --- CONTENT GENERATORS (All use "../CartContext") ---

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

const simplePage = (title) => `import React from "react";
const ${title} = () => <div style={{padding: "20px"}}><h1>${title}</h1></div>;
export default ${title};`;

// --- NAVBAR (With your requested links) ---
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
        <button onClick={handleLogout} style={{ marginLeft: "20px", background: "transparent", border: "1px solid white", color: "white", padding: "
