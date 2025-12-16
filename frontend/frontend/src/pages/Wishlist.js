import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";

const Wishlist = () => {
  // Safe access to context in case it's loading
  const { wishlist = [], removeFromWishlist, addToCart } = useContext(CartContext) || {};

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>❤️ My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {wishlist.map((item) => (
            <div key={item._id} style={{ border: "1px solid #ddd", padding: "15px", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

export default Wishlist;