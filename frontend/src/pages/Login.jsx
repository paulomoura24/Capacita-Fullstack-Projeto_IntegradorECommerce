import React, { useState } from 'react'
import { api } from '../services/api'
import { useNavigate } from 'react-router-dom'
export default function Login() {
  const [email, setEmail] = useState('cliente@example.com'); const [password, setPassword] = useState('123456'); const [error, setError] = useState(''); const navigate = useNavigate()
  async function submit(e) {
    e.preventDefault()
    setError('')

    try {
      const res = await api.login({ email, password })
      const token = res?.token
      const roleFromLogin = (res?.user?.role || '').toString().toUpperCase()

      if (!token) throw new Error('Login inválido: token ausente')

      localStorage.setItem('token', token)
      if (roleFromLogin) {
        localStorage.setItem('role', roleFromLogin)
      } else {
        localStorage.setItem('role', 'CLIENT')
      }

      window.dispatchEvent(new Event('auth-changed'))

      if (roleFromLogin === 'ADMIN') {
        navigate('/admin/produtos', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Falha ao entrar')
    }
  }
  return (<div className="container">
    <h2>Entrar</h2><hr />
    <form className="card" onSubmit={submit}>
      {error && <div className="error">Erro: {error}</div>}
      <label>E-mail<input className="input" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Senha<input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)} /></label>
      <button className="btn" type="submit">Entrar</button>
    </form>
    <p style={{ opacity: .8, marginTop: 12 }}>Ainda não tem conta? <a href="/cadastro">Cadastre-se</a></p>
  </div>)
}