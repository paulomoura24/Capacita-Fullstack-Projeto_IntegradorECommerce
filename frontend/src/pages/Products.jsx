import React, { useEffect, useState } from 'react'
import { api } from '../services/api'
import ProductCard from '../components/ProductCard'
export default function Products(){
  const [data,setData]=useState([]); const [q,setQ]=useState(''); const [loading,setLoading]=useState(true); const [error,setError]=useState('')
  useEffect(()=>{ setLoading(true); setError(''); api.listProducts().then(arr=>setData(Array.isArray(arr)?arr:[])).catch(e=>setError(e.message)).finally(()=>setLoading(false)) },[])
  const filtered = data.filter(p => (p?.title||'').toLowerCase().includes(q.toLowerCase()))
  return (<div className="container">
    <div className="row" style={{alignItems:'center',justifyContent:'space-between'}}>
      <h2>Produtos</h2>
      <input className="input" placeholder="Buscar por título..." value={q} onChange={e=>setQ(e.target.value)}/>
    </div>
    <hr/>
    {loading && <div className="empty">Carregando...</div>}
    {!loading && error && <div className="empty">Erro: {error}</div>}
    {!loading && !error && (filtered.length ? <div className="grid">{filtered.map(p=> <ProductCard key={p.id} p={p}/>)}</div> : <div className="empty">Nenhum produto encontrado</div>)}
  </div>)
}