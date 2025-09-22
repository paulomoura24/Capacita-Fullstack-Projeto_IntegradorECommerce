import React from 'react'
import { Link } from 'react-router-dom'
export default function Home(){ return (
  <div className="container">
    <section className="card" style={{display:'grid', gridTemplateColumns:'1.2fr 1fr', gap:16, alignItems:'center'}}>
      <div>
        <h1 style={{margin:'0 0 8px'}}>Bem-vindo à Livraria Pó de Giz</h1>
        <p style={{opacity:.8}}>Conhecimento, boas histórias e integração completa com nossa API.</p>
        <div className="row" style={{marginTop:12}}>
          <Link className="btn" to="/produtos">Explorar produtos</Link>
          <Link className="btn ghost" to="/cadastro">Criar conta</Link>
        </div>
      </div>
      <div style={{justifySelf:'center'}}>
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=800&auto=format&fit=crop" alt="Livros" style={{borderRadius:16}}/>
      </div>
    </section>
  </div>
)}