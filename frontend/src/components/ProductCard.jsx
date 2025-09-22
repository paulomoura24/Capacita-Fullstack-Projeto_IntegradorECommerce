import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
const PLACEHOLDER='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 600 600\"><rect width=\"600\" height=\"600\" fill=\"#15161a\"/><text x=\"50%\" y=\"50%\" fill=\"#aaa\" text-anchor=\"middle\" font-family=\"Arial\" font-size=\"20\">Sem imagem</text></svg>')
export default function ProductCard({p={}}){
  const [src, setSrc] = useState(p?.id ? api.getProductImageUrl(p.id) : PLACEHOLDER)
  const title = p?.title ?? 'Produto'; const price = Number(p?.price ?? 0)
  return (<div className="card">
    <div style={{borderRadius:12, aspectRatio:'1/1', background:'#0f1013', overflow:'hidden'}}>
      <img src={src} alt={title} style={{width:'100%',height:'100%',objectFit:'cover'}} onError={()=>setSrc(PLACEHOLDER)}/>
    </div>
    <h3 style={{margin:'10px 0'}}>{title}</h3>
    <div className="row" style={{justifyContent:'space-between',alignItems:'center'}}>
      <span className="price">R$ {price.toFixed(2)}</span>
      {p?.id ? <Link className="btn ghost" to={`/produtos/${p.id}`}>Ver</Link> : <span className="badge">Indisponível</span>}
    </div>
  </div>)
}