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

export default Navbar;