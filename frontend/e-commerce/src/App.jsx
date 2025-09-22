// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import ProductForm from "./pages/ProductForm";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ClientPanel from "./pages/ClientPanel";
import SellerPanel from "./pages/SellerPanel";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/client" element={<ClientPanel />} />
          <Route path="/seller" element={<SellerPanel />} />
          <Route path="/client" element={<ProtectedRoute role="cliente"><ClientPanel /></ProtectedRoute>} />
          <Route path="/seller" element={<ProtectedRoute role="vendedor"><SellerPanel /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
