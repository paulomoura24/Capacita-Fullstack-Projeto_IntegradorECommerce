import React, { useState } from 'react'
import { useCart } from '../store/cart'
import { api } from '../services/api'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'

export default function Checkout() {
  const { items, total, clear } = useCart()
  const { toast } = useToast()
  const [shippingAddress, setShippingAddress] = useState('Rua Exemplo, 123 - Barreira/CE')
  const [holderName, setHolderName] = useState('Fulano')
  const [cardNumber, setCardNumber] = useState('4111111111111111')
  const [expMonth, setExpMonth] = useState(12)
  const [expYear, setExpYear] = useState(2030)
  const [cvv, setCvv] = useState('123')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  function validate(items, shippingAddress, holderName, cardNumber, expMonth, expYear, cvv) {
    if (!items.length) throw new Error('Carrinho vazio')
    if (!shippingAddress || shippingAddress.length < 8) throw new Error('Endereço de envio inválido')
    if (!holderName || holderName.length < 3) throw new Error('Nome do titular inválido')
    if (!/^[0-9]{13,19}$/.test(String(cardNumber))) throw new Error('Número do cartão inválido')
    const m = Number(expMonth), y = Number(expYear)
    if (m < 1 || m > 12) throw new Error('Mês inválido')
    const nowY = new Date().getFullYear()
    if (y < nowY) throw new Error('Ano inválido')
    if (!/^[0-9]{3,4}$/.test(String(cvv))) throw new Error('CVV inválido')

    // ⬅️ validação de itens (productId numérico e quantity >=1)
    items.forEach((i, idx) => {
      const pid = Number(i.product?.id)
      const qty = Number(i.quantity)
      if (!Number.isInteger(pid) || pid <= 0) {
        throw new Error(`Item ${idx + 1}: productId inválido`)
      }
      if (!Number.isInteger(qty) || qty < 1) {
        throw new Error(`Item ${idx + 1}: quantity inválido`)
      }
    })
  }

  async function finish(e) {
    e.preventDefault()
    setError('')
    try {
      const token = localStorage.getItem('token')
      if (!token) throw new Error('Faça login para finalizar')

      validate(items, shippingAddress, holderName, cardNumber, expMonth, expYear, cvv)

      const safeItems = items.map(i => ({
        productId: Number(i.product.id),
        quantity: Number(i.quantity)
      }))

      const payload = {
        items: safeItems,
        shippingAddress,
        payment: {
          holderName,
          cardNumber: String(cardNumber),
          expMonth: Number(expMonth),
          expYear: Number(expYear),
          cvv: String(cvv)
        }
      }

      const order = await api.createOrder(token, payload)
      clear()
      toast('Pagamento aprovado! Pedido #' + (order?.id ?? 'OK'))
      navigate('/pedidos')
    } catch (err) {
      try {
        const parsed = JSON.parse(err.message)
        if (parsed?.message) {
          const det = Array.isArray(parsed.details) ? ` (${parsed.details.map(d => d.message).join('; ')})` : ''
          setError(parsed.message + det)
          return
        }
      } catch { }
      setError(err.message || 'Erro ao processar pagamento')
    }
  }

  if (!items.length) return <div className="container"><div className="empty">Seu carrinho está vazio.</div></div>

  return (
    <div className="container">
      <h2>Checkout</h2><hr />
      <div className="card">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <div>Total</div><div className="price">R$ {total.toFixed(2)}</div>
        </div>
        <hr />
        <form onSubmit={finish} className="row" style={{ flexDirection: 'column', gap: 12 }}>
          {error && <div className="error">Erro: {error}</div>}
          <label>Endereço de envio
            <input className="input" value={shippingAddress} onChange={e => setShippingAddress(e.target.value)} required />
          </label>
          <h4>Pagamento</h4>
          <label>Nome no cartão
            <input className="input" value={holderName} onChange={e => setHolderName(e.target.value)} required />
          </label>
          <label>Número do cartão
            <input className="input" value={cardNumber} onChange={e => setCardNumber(e.target.value)} required />
          </label>
          <div className="row">
            <label style={{ flex: 1 }}>Mês
              <input className="input" type="number" min="1" max="12" value={expMonth} onChange={e => setExpMonth(e.target.value)} required />
            </label>
            <label style={{ flex: 2 }}>Ano
              <input className="input" type="number" value={expYear} onChange={e => setExpYear(e.target.value)} required />
            </label>
            <label style={{ flex: 1 }}>CVV
              <input className="input" value={cvv} onChange={e => setCvv(e.target.value)} required />
            </label>
          </div>
          <button className="btn" type="submit">Pagar</button>
        </form>
      </div>
    </div>
  )
}
