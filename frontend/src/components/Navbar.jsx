import React, { useEffect, useState, useCallback } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../store/cart'

export default function Navbar() {
  const navigate = useNavigate()
  const { items } = useCart()
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [role, setRole] = useState((localStorage.getItem('role') || 'CLIENT').toUpperCase())

  const count = items.reduce((acc, it) => acc + it.quantity, 0)

  const readAuth = useCallback(() => {
    setToken(localStorage.getItem('token') || '')
    setRole((localStorage.getItem('role') || 'CLIENT').toUpperCase())
  }, [])

  useEffect(() => {
    // atualiza na montagem e quando houver eventos
    readAuth()
    const onAuth = () => readAuth()
    window.addEventListener('auth-changed', onAuth)
    window.addEventListener('storage', onAuth)
    window.addEventListener('focus', onAuth)
    return () => {
      window.removeEventListener('auth-changed', onAuth)
      window.removeEventListener('storage', onAuth)
      window.removeEventListener('focus', onAuth)
    }
  }, [readAuth])

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('role')
    window.dispatchEvent(new Event('auth-changed'))
    navigate('/login')
  }

  return (
    <nav className="nav">
      <div className="brand">📚 Livraria Pó de Giz</div>
      <NavLink to="/" end>Início</NavLink>
      <NavLink to="/produtos">Produtos</NavLink>
      <NavLink to="/carrinho">Carrinho{count > 0 && <span className="badge" style={{ marginLeft: 8 }}>{count}</span>}</NavLink>
      {role === 'ADMIN' && <NavLink to="/admin/produtos">Admin</NavLink>}
      <span className="spacer" />
      {token ? (
        <>
          <NavLink to="/pedidos">Meus pedidos</NavLink>
          <button className="btn ghost" onClick={logout}>Sair</button>
        </>
      ) : (
        <>
          <Link className="btn secondary" to="/login">Entrar</Link>
          <Link className="btn" to="/cadastro">Criar conta</Link>
        </>
      )}
    </nav>
  )
}
