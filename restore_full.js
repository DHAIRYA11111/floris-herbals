const fs = require('fs');
const path = require('path');

// Helper to create file if it doesn't exist
const ensureFile = (filePath, content) => {
  const fullPath = path.join(process.cwd(), filePath);
  const dir = path.dirname(fullPath);
  
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // ONLY write if missing (protects your data if it exists)
  if (!fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, content);
    console.log(`✅ Restored: ${filePath}`);
  } else {
    console.log(`⚡️ Skipped (Already exists): ${filePath}`);
  }
};

// 1. App.js (The Main Router)
const appCode = `import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Wishlist from "./pages/Wishlist";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </>
  );
}
export default App;`;

// 2. Navbar.js (With your requested Links)
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

  const navStyle = { display: "flex", justifyContent: "space-between", padding: "1rem 2rem", background: "#1a1a1a", color: "#fff", alignItems: "center" };
  const linkStyle = { color: "#fff", textDecoration: "none", marginLeft: "20px" };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ ...linkStyle, fontSize: "1.5rem", fontWeight: "bold", marginLeft: 0 }}>🌿 Floris Herbals</Link>
      <div>
        <Link to="/" style={linkStyle}>Home</Link>
        {/* The new categories you wanted */}
        <Link to="/category/soaps" style={linkStyle}>Soaps</Link>
        <Link to="/category/oils" style={linkStyle}>Pooja Oils</Link>
        
        <Link to="/wishlist" style={linkStyle}>
          ❤️ Wishlist {wishlist.length > 0 && <span>({wishlist.length})</span>}
        </Link>
        <Link to="/cart" style={linkStyle}>
          🛒 Cart {cart.length > 0 && <span>({cart.reduce((a, c) => a + c.qty, 0)})</span>}
        </Link>
        <Link to="/admin" style={{ ...linkStyle, color: "#ffc107" }}>Admin</Link>
        <button onClick={handleLogout} style={{ marginLeft: "20px", background: "transparent", border: "1px solid white", color: "white", borderRadius: "5px" }}>Logout</button>
      </div>
    </nav>
  );
};
export default Navbar;`;

// 3. Home.js (Your Main Shop)
const homeCode = `import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../context/CartContext";

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

// 4. Basic Login & Register (Placeholders to prevent crash)
const loginCode = `import React from "react"; const Login = () => <h1>Login Page</h1>; export default Login;`;
const registerCode = `import React from "react"; const Register = () => <h1>Register Page</h1>; export default Register;`;
const adminCode = `import React from "react"; const AdminDashboard = () => <h1>Admin Dashboard</h1>; export default AdminDashboard;`;

// EXECUTE RESTORATION
ensureFile('frontend/src/App.js', appCode);
ensureFile('frontend/src/components/Navbar.js', navbarCode);
ensureFile('frontend/src/pages/Home.js', homeCode);
ensureFile('frontend/src/pages/Login.js', loginCode);
ensureFile('frontend/src/pages/Register.js', registerCode);
ensureFile('frontend/src/pages/AdminDashboard.js', adminCode);
ensureFile('frontend/src/App.css', ""); // Empty CSS to prevent import errors

console.log("\\n🎉 Restoration Complete. Push now!");
