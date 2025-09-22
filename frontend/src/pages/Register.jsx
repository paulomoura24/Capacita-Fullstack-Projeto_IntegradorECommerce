import React, { useState } from 'react'
import { api } from '../services/api'
import { useNavigate } from 'react-router-dom'
export default function Register(){
  const [name,setName]=useState('Cliente'); const [email,setEmail]=useState('cliente@example.com'); const [password,setPassword]=useState('123456'); const [error,setError]=useState(''); const navigate=useNavigate()
  async function submit(e){ e.preventDefault(); setError(''); try{ await api.register({ name, email, password, role:'CLIENT' }); navigate('/login') } catch(err){ setError(err.message) } }
  return (<div className="container">
    <h2>Criar conta</h2><hr/>
    <form className="card" onSubmit={submit}>
      {error && <div className="error">Erro: {error}</div>}
      <label>Nome<input className="input" value={name} onChange={e=>setName(e.target.value)} required minLength={2} /></label>
      <label>E-mail<input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required /></label>
      <label>Senha<input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} /></label>
      <button className="btn" type="submit">Cadastrar</button>
    </form>
  </div>)
}