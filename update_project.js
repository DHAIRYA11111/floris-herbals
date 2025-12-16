const fs = require('fs');
const path = require('path');

// HELPER: Ensure directory exists
const ensureDir = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
};

// HELPER: Write file
const writeFile = (filePath, content) => {
  const targetPath = path.join(__dirname, filePath);
  ensureDir(targetPath);
  fs.writeFileSync(targetPath, content.trim());
  console.log(`✅ Updated: ${filePath}`);
};

// =======================
// 1. BACKEND FILES
// =======================

const userModel = `
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  wishlist: { type: Array, default: [] }
});
module.exports = mongoose.model("User", userSchema);
`;

const orderModel = `
const mongoose = require("mongoose");
const orderSchema = new mongoose.Schema({
  userId: String,
  products: Array,
  amount: Number,
  paymentId: String,
  status: { type: String, default: "Processing" },
  createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model("Order", orderSchema);
`;

const authRoutes = `
const express = require("express");
const User = require("../models/User");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.create({ name, email, password });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

router.post("/wishlist", async (req, res) => {
  const { userId, wishlist } = req.body;
  await User.findByIdAndUpdate(userId, { wishlist });
  res.json({ success: true });
});

module.exports = router;
`;

const adminRoutes = `
const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

router.get("/orders", async (req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json(orders);
});

router.put("/order/:id", async (req, res) => {
  const { status } = req.body;
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  res.json(order);
});

router.get("/my-orders/:userId", async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId }).sort({ createdAt: -1 });
  res.json(orders);
});

module.exports = router;
`;

const paymentRoutes = `
const express = require("express");
const razorpay = require("../config/razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const router = express.Router();

router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR"
  });
  res.json({ order });
});

router.post("/verify", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, products, amount, userId } = req.body;
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expected === razorpay_signature) {
    await Order.create({
      userId,
      products,
      amount,
      paymentId: razorpay_payment_id,
      status: "Processing"
    });
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false });
  }
});

module.exports = router;
`;

const serverJs = `
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));

app.listen(process.env.PORT, () => {
  console.log(\`Floris Herbals backend running on port \${process.env.PORT}\`);
});
`;

// =======================
// 2. FRONTEND FILES
// =======================

const authContext = `
import { createContext, useContext, useState, useEffect } from "react";
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/";
  };
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
`;

const loginPage = `
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (res.ok) {
      login(data);
      if (data.isAdmin) navigate("/admin");
      else navigate("/account");
    } else {
      alert("Invalid login");
    }
  };

  return (
    <div style={{ padding: "100px 20px", textAlign: "center" }}>
      <h2 style={{ fontFamily: "Playfair Display, serif", marginBottom: 30 }}>Sign In</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: 300, margin: "auto", gap: 15 }}>
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ padding: 12, border: "1px solid #ddd" }} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ padding: 12, border: "1px solid #ddd" }} />
        <button className="btn-primary" style={{ marginTop: 10 }}>Login</button>
      </form>
      <p style={{ marginTop: 20 }}>New here? <Link to="/register" style={{ textDecoration: "underline" }}>Create an account</Link></p>
    </div>
  );
}
`;

const registerPage = `
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    if (res.ok) {
      alert("Registration successful! Please login.");
      navigate("/login");
    } else {
      alert("Registration failed.");
    }
  };

  return (
    <div style={{ padding: "100px 20px", textAlign: "center" }}>
      <h2 style={{ fontFamily: "Playfair Display, serif", marginBottom: 30 }}>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", maxWidth: 300, margin: "auto", gap: 15 }}>
        <input placeholder="Name" onChange={e => setName(e.target.value)} style={{ padding: 12, border: "1px solid #ddd" }} />
        <input placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ padding: 12, border: "1px solid #ddd" }} />
        <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} style={{ padding: 12, border: "1px solid #ddd" }} />
        <button className="btn-primary" style={{ marginTop: 10 }}>Register</button>
      </form>
      <p style={{ marginTop: 20 }}>Already have an account? <Link to="/login" style={{ textDecoration: "underline" }}>Sign In</Link></p>
    </div>
  );
}
`;

const accountPage = `
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

export default function Account() {
  const { user, logout } = useAuth();
  const { wishlist } = useWishlist();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      fetch(\`http://localhost:5001/api/admin/my-orders/\${user._id}\`)
        .then(res => res.json())
        .then(data => setOrders(data));
    }
  }, [user]);

  if (!user) return <div style={{padding: 50, textAlign:'center'}}>Please <a href="/login">login</a> first.</div>;

  return (
    <div style={{ padding: "60px 20px", maxWidth: "1000px", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2 style={{ fontFamily: "Playfair Display, serif" }}>Hello, {user.name}</h2>
        <button onClick={logout} style={{ textDecoration: "underline" }}>Logout</button>
      </div>

      <h3 style={{ marginTop: 40, borderBottom: "1px solid #ddd", paddingBottom: 10 }}>My Orders</h3>
      {orders.length === 0 ? <p style={{marginTop:20, color:'#777'}}>No orders yet.</p> : (
        orders.map(order => (
          <div key={order._id} style={{ padding: "20px", background: "#f9f9f9", marginTop: 15, borderRadius: 5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600 }}>
              <span>Order #{order._id.slice(-6)}</span>
              <span style={{ color: order.status === "Delivered" ? "green" : "orange" }}>{order.status}</span>
            </div>
            <div style={{ marginTop: 10, color: "#555" }}>
              {order.products.map(p => p.name).join(", ")}
            </div>
            <div style={{ marginTop: 10, fontWeight: "bold" }}>Total: ₹{order.amount}</div>
          </div>
        ))
      )}

      <h3 style={{ marginTop: 60, borderBottom: "1px solid #ddd", paddingBottom: 10 }}>My Wishlist</h3>
      <div style={{ display: "flex", gap: 30, flexWrap: "wrap", marginTop: 20 }}>
        {wishlist.length === 0 ? <p style={{color:'#777'}}>No items in wishlist.</p> : wishlist.map(p => (
          <div key={p.id} style={{ width: 160 }}>
            <img src={p.img} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 5 }} />
            <div style={{ fontSize: 14, marginTop: 8, fontWeight: 500 }}>{p.name}</div>
            <div style={{ fontSize: 13, color: "#777" }}>₹{p.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
`;

const adminDashboard = `
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if(!user?.isAdmin) navigate("/");
    fetch("http://localhost:5001/api/admin/orders")
      .then(res => res.json())
      .then(data => setOrders(data));
  }, [user, navigate]);

  const updateStatus = async (id, newStatus) => {
    await fetch(\`http://localhost:5001/api/admin/order/\${id}\`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });
    setOrders(orders.map(o => o._id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2 style={{ fontFamily: "Playfair Display, serif" }}>Admin Dashboard</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 30, fontSize: 14 }}>
        <thead>
          <tr style={{ textAlign: "left", background: "#f4f4f4" }}>
            <th style={{ padding: 12 }}>Order ID</th>
            <th style={{ padding: 12 }}>Customer ID</th>
            <th style={{ padding: 12 }}>Items</th>
            <th style={{ padding: 12 }}>Amount</th>
            <th style={{ padding: 12 }}>Status</th>
            <th style={{ padding: 12 }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 12 }}>{order._id.slice(-6)}</td>
              <td style={{ padding: 12 }}>{order.userId || "Guest"}</td>
              <td style={{ padding: 12 }}>
                {order.products.map(p => p.name).join(", ")}
              </td>
              <td style={{ padding: 12 }}>₹{order.amount}</td>
              <td style={{ padding: 12, fontWeight: "bold", color: order.status === "Shipped" ? "green" : "orange" }}>
                {order.status}
              </td>
              <td style={{ padding: 12 }}>
                <select onChange={(e) => updateStatus(order._id, e.target.value)} defaultValue="" style={{padding: 5}}>
                  <option value="" disabled>Update Status</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
`;

const checkoutJs = `
import { useCart } from "./context/CartContext";
import { useAuth } from "./context/AuthContext";

export default function Checkout() {
  const { cart, totalAmount } = useCart();
  const { user } = useAuth();

  const payNow = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    if (!user) {
      alert("Please login to checkout so we can track your order!");
      window.location.href = "/login";
      return;
    }
    const res = await fetch("http://localhost:5001/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: totalAmount, products: cart })
    });
    const data = await res.json();
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_xxxxxxxxxx",
      amount: totalAmount * 100,
      currency: "INR",
      name: "Floris Herbals",
      description: "Order Payment",
      order_id: data.order.id,
      handler: async function (response) {
        await fetch("http://localhost:5001/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            products: cart,
            amount: totalAmount,
            userId: user._id
          })
        });
        alert("Payment successful! Track order in Account.");
        localStorage.removeItem("cart");
        window.location.href = "/account";
      },
      theme: { color: "#5a7f4f" }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ padding: "60px 20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, maxWidth: 1000, margin: "auto" }}>
      <div>
        <h2 style={{ fontFamily: "Playfair Display, serif", marginBottom: 20 }}>Checkout</h2>
        <p style={{marginBottom: 20}}>Logged in as: <strong>{user ? user.name : "Guest"}</strong></p>
        <form style={{ display: "flex", flexDirection: "column", gap: 15 }}>
          <input type="text" placeholder="Address" style={{ padding: 12, border: "1px solid #ddd" }} />
          <input type="text" placeholder="City" style={{ padding: 12, border: "1px solid #ddd" }} />
          <input type="text" placeholder="PIN Code" style={{ padding: 12, border: "1px solid #ddd" }} />
        </form>
      </div>
      <div style={{ background: "#fafafa", padding: 30, borderRadius: 8 }}>
        <h3 style={{ marginBottom: 20 }}>Order Summary</h3>
        {cart.map((p, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <span>{p.name}</span>
            <span>₹{p.price}</span>
          </div>
        ))}
        <div style={{ borderTop: "1px solid #eee", margin: "20px 0" }}></div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: 18 }}>
          <span>Total</span>
          <span>₹{totalAmount}</span>
        </div>
        <button onClick={payNow} className="btn-primary" style={{ marginTop: 20 }}>
          PAY NOW
        </button>
      </div>
    </div>
  );
}
`;

const appJs = `
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Navbar";
import Home from "./Home";
import Products from "./Products";
import Checkout from "./Checkout";
import Sidebar from "./components/Sidebar";
import CartDrawer from "./components/CartDrawer";
import SearchDrawer from "./components/SearchDrawer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Account from "./pages/Account";
import AdminDashboard from "./pages/AdminDashboard";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const closeAll = () => { setIsMenuOpen(false); setIsCartOpen(false); setIsSearchOpen(false); };
  return (
    <BrowserRouter>
      <Sidebar isOpen={isMenuOpen} close={closeAll} />
      <CartDrawer isOpen={isCartOpen} close={closeAll} />
      <SearchDrawer isOpen={isSearchOpen} close={closeAll} />
      <div className={\`overlay \${isMenuOpen || isCartOpen || isSearchOpen ? "open" : ""}\`} onClick={closeAll} />
      <Navbar onOpenMenu={() => setIsMenuOpen(true)} onOpenCart={() => setIsCartOpen(true)} onOpenSearch={() => setIsSearchOpen(true)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:category" element={<Products />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/account" element={<Account />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
`;

const indexJs = `
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <CartProvider>
      <WishlistProvider>
        <App />
      </WishlistProvider>
    </CartProvider>
  </AuthProvider>
);
`;

// WRITING THE FILES
writeFile("backend/models/User.js", userModel);
writeFile("backend/models/Order.js", orderModel);
writeFile("backend/routes/authRoutes.js", authRoutes);
writeFile("backend/routes/adminRoutes.js", adminRoutes);
writeFile("backend/routes/paymentRoutes.js", paymentRoutes);
writeFile("backend/server.js", serverJs);
writeFile("src/context/AuthContext.js", authContext);
writeFile("src/pages/Login.js", loginPage);
writeFile("src/pages/Register.js", registerPage);
writeFile("src/pages/Account.js", accountPage);
writeFile("src/pages/AdminDashboard.js", adminDashboard);
writeFile("src/Checkout.js", checkoutJs);
writeFile("src/App.js", appJs);
writeFile("src/index.js", indexJs);

console.log("\n🚀 ALL FILES UPDATED SUCCESSFULLY! PLEASE RESTART SERVER.");
