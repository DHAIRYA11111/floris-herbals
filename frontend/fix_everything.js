const fs = require('fs');
const path = require('path');

// Helper to write files safely
const writeFile = (relPath, content) => {
  // Construct full path: current folder -> frontend -> src -> relative path
  const fullPath = path.join(process.cwd(), 'src', relPath); 
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Created: src/${relPath}`);
};

// --- 1. Wishlist.js (The Missing File) ---
const wishlistCode = `import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Wishlist = () => {
  const { wishlist = [], removeFromWishlist, addToCart } = useContext(CartContext) || {};

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>❤️ My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {wishlist.map((item) => (
            <div key={item._id} style={{ 
              border: "1px solid #ddd", 
              padding: "15px", 
              borderRadius: "8px", 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center" 
            }}>
              <div>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
              </div>
              <div>
                <button 
                  onClick={() => addToCart(item)} 
                  style={{ background: "#28a745", color: "white", border: "none", padding: "8px 12px", marginRight: "10px", borderRadius: "5px", cursor: "pointer" }}>
                  Move to Cart
                </button>
                <button 
                  onClick={() => removeFromWishlist(item._id)} 
                  style={{ background: "#dc3545", color: "white", border: "none", padding: "8px 12px", borderRadius: "5px", cursor: "pointer" }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;`;

// --- 2. Navbar.js (Ensuring links work) ---
const navbarCode = `import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  const { cart = [], wishlist = [] } = useContext(CartContext) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    navigate("/login");
  };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 100
  };

  const linkStyle = { color: "#fff", textDecoration: "none", marginLeft: "20px" };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ ...linkStyle, fontSize: "1.5rem", fontWeight: "bold", marginLeft: 0 }}>
        🌿 Floris Herbals
      </Link>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={linkStyle}>Home</Link>
        <Link to="/wishlist" style={linkStyle}>
          ❤️ Wishlist {wishlist.length > 0 && <span>({wishlist.length})</span>}
        </Link>
        <Link to="/cart" style={linkStyle}>
          🛒 Cart {cart.length > 0 && <span>({cart.reduce((acc, item) => acc + item.qty, 0)})</span>}
        </Link>
        <Link to="/admin" style={{ ...linkStyle, color: "#ffc107" }}>Admin</Link>
        <button onClick={handleLogout} style={{ marginLeft: "20px", background: "transparent", border: "1px solid white", color: "white", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;`;

// --- EXECUTE ---
console.log("🚀 Writing files...");
// Note: We are already inside the 'frontend' folder when we run this usually, 
// but to be safe, this script assumes you run it inside 'frontend'.
writeFile('pages/Wishlist.js', wishlistCode);
writeFile('components/Navbar.js', navbarCode);
console.log("🏁 Done.");
