import React, { createContext, useState, useEffect, useContext } from "react";
export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem("cart") || "[]"));
  const [wishlist, setWishlist] = useState(() => JSON.parse(localStorage.getItem("wishlist") || "[]"));

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [cart, wishlist]);

  const addToCart = (p) => setCart(prev => {
    const ex = prev.find(x => x._id === p._id);
    return ex ? prev.map(x => x._id === p._id ? {...x, qty: x.qty+1} : x) : [...prev, {...p, qty: 1}];
  });
  const removeFromCart = (id) => setCart(prev => prev.filter(x => x._id !== id));
  const addToWishlist = (p) => setWishlist(prev => prev.find(x => x._id === p._id) ? prev : [...prev, p]);
  const removeFromWishlist = (id) => setWishlist(prev => prev.filter(x => x._id !== id));

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </CartContext.Provider>
  );
};
