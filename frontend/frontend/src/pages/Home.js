import React, { useEffect, useState, useContext } from "react";
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
export default Home;