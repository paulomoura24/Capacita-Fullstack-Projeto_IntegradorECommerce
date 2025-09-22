import React, { useEffect, useState } from 'react'
import { api } from '../services/api'
export default function Orders(){
  const [list,setList]=useState([]); const [loading,setLoading]=useState(true); const [error,setError]=useState('')
  useEffect(()=>{
    const token=localStorage.getItem('token'); if(!token){ setLoading(false); return }
    setLoading(true); setError('')
    api.myOrders(token).then(setList).catch(e=>setError(e.message)).finally(()=>setLoading(false))
  },[])
  return (<div className="container">
    <h2>Pedidos</h2><hr/>
    {loading ? <div className="empty">Carregando...</div> : error ? <div className="empty">Erro: {error}</div> : (
      <div className="grid">
        {list.map(o=>(<div key={o.id} className="card">
          <div style={{fontWeight:700}}>Pedido #{o.id}</div>
          <div className="badge">Status: {o.status}</div>
          <div>Total: <strong>R$ {Number(o.total).toFixed(2)}</strong></div>
          {o.shippingAddress && <div>Envio: {o.shippingAddress}</div>}
          <div style={{marginTop:8}}>
            <div style={{opacity:.8, marginBottom:6}}>Itens:</div>
            {(o.items||[]).map(it => (
              <div key={it.id} className="row" style={{justifyContent:'space-between'}}>
                <div>{it.product?.title || ('#'+it.productId)}</div>
                <div>x{it.quantity}</div>
                <div>R$ {Number(it.unitPrice).toFixed(2)}</div>
              </div>
            ))}
          </div>
          {o.payment && <div style={{marginTop:8}}>Pagamento: {o.payment.status} — ****{o.payment.cardLast4}</div>}
        </div>))}
      </div>
    )}
  </div>)
}