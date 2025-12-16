import React, { useContext } from "react";
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
export default Navbar;