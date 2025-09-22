import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../services/api'
import { useCart } from '../store/cart'
import { useToast } from '../components/Toast'

const PLACEHOLDER = 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><rect width="600" height="400" fill="#1b1c20"/><text x="50%" y="50%" fill="#aaa" text-anchor="middle" font-family="Arial" font-size="20">Sem imagem</text></svg>')

export default function ProductDetail() {
  const { id } = useParams()
  const [p, setP] = useState(null)
  const [qty, setQty] = useState(1)
  const [img, setImg] = useState(null)
  const { add } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    api.getProduct(id).then(pr => {
      setP(pr)
      setImg(api.getProductImageUrl(pr.id))
      const st = Number(pr.stock ?? 0) || 0
      setQty(st > 0 ? 1 : 1)
    }).catch(() => setP(null))
  }, [id])

  if (!p) return <div className="container"><div className="empty">Carregando...</div></div>

  const stock = Number(p.stock ?? 0) || 0
  const canBuy = stock > 0
  const safeQty = Math.max(1, Math.min(qty, stock || qty))

  return (
    <div className="container">
      <div className="row" style={{ gap: 24 }}>
        <div style={{ flex: '0 0 340px' }}>
          <img src={img || PLACEHOLDER} alt={p.title} style={{ borderRadius: 16 }} onError={() => setImg(PLACEHOLDER)} />
        </div>
        <div style={{ flex: 1 }}>
          <h2>{p.title}</h2>
          <div className="badge">Estoque: {stock}</div>
          <p style={{ opacity: .85, marginTop: 8 }}>{p.description || ''}</p>
          <h3 className="price">R$ {Number(p.price).toFixed(2)}</h3>
          <div className="row">
            <input
              className="input"
              type="number"
              min="1"
              max={stock || undefined}
              value={safeQty}
              onChange={e => {
                const v = Number(e.target.value || 1)
                const capped = stock > 0 ? Math.min(Math.max(1, v), stock) : Math.max(1, v)
                setQty(capped)
              }}
              style={{ maxWidth: 120 }}
              disabled={!canBuy}
            />
            <button
              className="btn"
              disabled={!canBuy}
              onClick={() => {
                if (!canBuy) return
                add(p, safeQty)
              }}
            >
              {canBuy ? 'Adicionar ao carrinho' : 'Sem estoque'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
