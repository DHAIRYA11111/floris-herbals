import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";

const Navbar = () => {
  // Safe check for cart to prevent crashes
  const { cart } = useContext(CartContext) || { cart: [] };

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

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    fontSize: "1rem",
    marginLeft: "20px",
    transition: "color 0.3s"
  };

  return (
    <nav style={navStyle}>
      {/* Brand Name */}
      <Link to="/" style={{ ...linkStyle, fontSize: "1.5rem", fontWeight: "bold", marginLeft: 0 }}>
        🌿 Floris Herbals
      </Link>

      {/* Navigation Links */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={linkStyle}>Home</Link>
        
        {/* --- NEW CATEGORIES --- */}
        <Link to="/category/pooja-oils" style={linkStyle}>Pooja Oils</Link>
        <Link to="/category/soap-fragrances" style={linkStyle}>Soap Fragrances</Link>
        <Link to="/category/raw-materials" style={linkStyle}>Raw Materials</Link>
        {/* ---------------------- */}

        <Link to="/wishlist" style={linkStyle}>❤️ Wishlist</Link>
        
        <Link to="/cart" style={linkStyle}>
          🛒 Cart {cart && cart.length > 0 && <span>({cart.length})</span>}
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
