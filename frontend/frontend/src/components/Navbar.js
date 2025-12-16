import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext"; 

const Navbar = () => {
  const { cart = [], wishlist = [] } = useContext(CartContext) || {};
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem("userInfo"); navigate("/login"); };

  const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#1a1a1a",
    color: "#fff",
    position: "sticky",
    top: 0,
    zIndex: 100
  };

  const linkStyle = {
    color: "#fff",
    textDecoration: "none",
    marginLeft: "20px",
    fontSize: "1rem"
  };

  return (
    <nav style={navStyle}>
      <Link to="/" style={{ ...linkStyle, fontSize: "1.5rem", fontWeight: "bold", marginLeft: 0 }}>
        🌿 Floris Herbals
      </Link>
      
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={linkStyle}>Home</Link>
        
        {/* --- THE NEW LINKS YOU WANTED --- */}
        <Link to="/category/pooja-oils" style={linkStyle}>Pooja Oils</Link>
        <Link to="/category/soap-fragrances" style={linkStyle}>Soap Fragrances</Link>
        <Link to="/category/raw-materials" style={linkStyle}>Raw Materials</Link>
        {/* ------------------------------- */}

        <Link to="/wishlist" style={linkStyle}>❤️ Wishlist ({wishlist.length})</Link>
        
        <Link to="/cart" style={linkStyle}>
          🛒 Cart ({cart.reduce((a,c)=>a+c.qty,0)})
        </Link>
        
        <button onClick={handleLogout} style={{ marginLeft: "20px", background: "transparent", border: "1px solid white", color: "white", padding: "5px 10px", borderRadius: "5px", cursor: "pointer" }}>
          Logout
        </button>
      </div>
    </nav>
  );
};
export default Navbar;
