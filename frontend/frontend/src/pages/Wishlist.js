import React, { useContext } from "react";
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
export default Wishlist;