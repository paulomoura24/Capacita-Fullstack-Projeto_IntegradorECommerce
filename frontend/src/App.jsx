import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Register from './pages/Register'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import { CartProvider } from './store/cart'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import { api } from './services/api'
import { ToastProvider } from './components/Toast'

export default function App() {

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    api.me(token)
      .then(me => {
        const r = (me?.role || me?.user?.role || me?.perfil || me?.type || '').toString().toUpperCase()
        if (r) {
          localStorage.setItem('role', r)
          window.dispatchEvent(new Event('auth-changed'))
        }
      })
      .catch(() => { })
  }, [])

  return (
    <CartProvider>
      <ToastProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/produtos" element={<Products />} />
          <Route path="/produtos/:id" element={<ProductDetail />} />
          <Route path="/carrinho" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedidos" element={<Orders />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Navigate to="produtos" replace />} />
            <Route path="produtos" element={<AdminProducts />} />
            <Route path="pedidos" element={<AdminOrders />} />
          </Route>
        </Routes>
        <Footer />
      </ToastProvider>
    </CartProvider >
  )
}
