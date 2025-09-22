import React from 'react'
import { useCart } from '../store/cart'
import { Link, useNavigate } from 'react-router-dom'

export default function Cart() {
  const { items, setQty, remove, total } = useCart()
  const navigate = useNavigate()

  const clampQty = (product, nextQty) => {
    const stock = Number(product?.stock ?? 0)
    const q = Math.max(1, Number(nextQty) || 1)
    if (stock > 0) return Math.min(q, stock)
    return q
  }

  if (!items.length) {
    return (
      <div className="container">
        <h2>Carrinho</h2><hr />
        <div className="empty">Seu carrinho está vazio</div>
        <div style={{ marginTop: 16 }}><Link className="btn ghost" to="/produtos">Continuar comprando</Link></div>
      </div>
    )
  }

  return (
    <div className="container">
      <h2>Carrinho</h2><hr />
      <div className="card">
        {items.map(({ product, quantity }, idx) => {
          const stock = Number(product?.stock ?? 0)
          const displayQty = clampQty(product, quantity)
          return (
            <div key={`${product.id}-${idx}`} className="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="row" style={{ alignItems: 'center', gap: 12 }}>
                <div style={{ fontWeight: 700 }}>{product.title}</div>
                <div className="badge">R$ {Number(product.price).toFixed(2)}</div>
                {Number.isFinite(stock) && stock >= 0 && (
                  <div className="badge">Estoque: {stock}</div>
                )}
              </div>

              <div className="row" style={{ alignItems: 'center', gap: 8 }}>
                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => setQty(product.id, clampQty(product, displayQty - 1))}
                  aria-label="Diminuir"
                >
                  –
                </button>

                <input
                  className="input"
                  type="number"
                  min="1"
                  value={displayQty}
                  style={{ maxWidth: 90, textAlign: 'center' }}
                  onChange={e => setQty(product.id, clampQty(product, e.target.value))}
                />

                <button
                  className="btn ghost"
                  type="button"
                  onClick={() => setQty(product.id, clampQty(product, displayQty + 1))}
                  aria-label="Aumentar"
                  disabled={stock > 0 && displayQty >= stock}
                  title={stock > 0 && displayQty >= stock ? 'Limite de estoque' : ''}
                >
                  +
                </button>

                <button
                  className="btn ghost"
                  onClick={() => { remove(product.id); }}
                >
                  Remover
                </button>
              </div>
            </div>
          )
        })}
        <hr />
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>Total</div><div className="price">R$ {total.toFixed(2)}</div>
        </div>
        <div className="row" style={{ justifyContent: 'flex-end' }}>
          <button className="btn" onClick={() => navigate('/checkout')}>Finalizar compra</button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link className="btn ghost" to="/produtos">Continuar comprando</Link>
      </div>
    </div>
  )
}
