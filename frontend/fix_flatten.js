const fs = require('fs');
const path = require('path');

// Helper to write files
const writeFile = (relPath, content) => {
  const fullPath = path.join(process.cwd(), 'frontend', 'src', relPath);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(fullPath, content);
  console.log(`✅ Updated: ${relPath}`);
};

// 1. CREATE CartContext.js in the ROOT of src (Bypassing the folder issue)
const contextCode = `import React, { createContext, useState, useEffect, useContext } from "react";
export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cart") || "[]"); } catch { return []; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem("wishlist") || "[]"); } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [cart, wishlist]);

  const addToCart = (product) => {
    setCart(prev => {
      const ex = prev.find(x => x._id === product._id);
      return ex ? prev.map(x => x._id === product._id ? {...x, qty: x.qty+1} : x) : [...prev, {...product, qty: 1}];
    });
  };
  const removeFromCart = (id) => setCart(prev => prev.filter(x => x._id !== id));
  const addToWishlist = (p) => setWishlist(prev => prev.find(x => x._id === p._id) ? prev : [...prev, p]);
  const removeFromWishlist = (id) => setWishlist(prev => prev.filter(x => x._id !== id));

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </CartContext.Provider>
  );
};`;

// 2. UPDATE App.js to import from the new location ("./CartContext")
const appCode = `import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import Wishlist from "./pages/Wishlist";
import { CartProvider } from "./CartContext"; // NEW LOCATION

function App() {
  return (
    <CartProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/wishlist" element={<Wishlist />} />
      </Routes>
    </CartProvider>
  );
}
export default App;`;

// 3. UPDATE Navbar.js to import from "../CartContext"
const navbarCode = `import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext"; // NEW LOCATION

const Navbar = () => {
  const { cart = [], wishlist = [] } = useContext(CartContext) || {};
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem("userInfo"); navigate("/login"); };

  return (
    <nav style={{ background: "#333", color: "#fff", padding: "15px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, zIndex: 100 }}>
      <Link to="/" style={{ color: "#fff", fontSize: "1.5rem", fontWeight: "bold", textDecoration: "none" }}>🌿 Floris Herbals</Link>
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>Home</Link>
        <Link to="/wishlist" style={{ color: "#fff", textDecoration: "none" }}>❤️ Wishlist ({wishlist.length})</Link>
        <Link to="/cart" style={{ color: "#fff", textDecoration: "none" }}>🛒 Cart ({cart.reduce((a,c)=>a+c.qty,0)})</Link>
        <button onClick={handleLogout} style={{ background: "transparent", border: "1px solid #fff", color: "#fff", padding: "5px 10px", borderRadius: "5px" }}>Logout</button>
      </div>
    </nav>
  );
};
export default Navbar;`;

// 4. UPDATE Wishlist.js to import from "../CartContext"
const wishlistCode = `import React, { useContext } from "react";
import { CartContext } from "../CartContext"; // NEW LOCATION

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

// 5. UPDATE Home.js to import from "../CartContext"
const homeCode = `import React, { useEffect, useState, useContext } from "react";
import { CartContext } from "../CartContext"; // NEW LOCATION

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

// EXECUTE
console.log("🚀 Moving CartContext to src/ root...");
writeFile('CartContext.js', contextCode);
writeFile('App.js', appCode);
writeFile('components/Navbar.js', navbarCode);
writeFile('pages/Wishlist.js', wishlistCode);
writeFile('pages/Home.js', homeCode);
console.log("🏁 Done. Structure flattened.");
