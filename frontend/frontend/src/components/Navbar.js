import React, { useContext } from "react";
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
export default Navbar;