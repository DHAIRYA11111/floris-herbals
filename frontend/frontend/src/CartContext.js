import React, { createContext, useState, useEffect, useContext } from "react";
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
};