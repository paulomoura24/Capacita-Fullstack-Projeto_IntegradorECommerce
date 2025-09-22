import React, { createContext, useContext, useMemo, useState } from 'react'
const CartCtx = createContext(null)
export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  const add = (product, quantity = 1) => setItems(prev => {
    const pid = Number(product?.id)
    const safeProduct = { ...product, id: pid }
    if (!Number.isInteger(pid) || pid <= 0) {
      console.warn('Produto com id inválido ao adicionar ao carrinho:', product)
      return prev
    }
    const stock = Number(safeProduct.stock ?? 0) || 0

    const i = prev.findIndex(p => p.product.id === pid)
    if (i >= 0) {
      const copy = [...prev]
      const current = copy[i]
      const newQty = Math.min(current.quantity + quantity, stock > 0 ? stock : current.quantity + quantity)
      copy[i] = { ...current, quantity: Math.max(1, newQty) }
      return copy
    }
    const firstQty = Math.max(1, Math.min(quantity, stock > 0 ? stock : quantity))
    return [...prev, { product: safeProduct, quantity: firstQty }]
  })


  const remove = (id) => setItems(prev => prev.filter(p => p.product.id !== id))
  const setQty = (id, q) => setItems(prev =>
    prev.map(it => {
      if (it.product.id !== id) return it
      const stock = Number(it.product.stock ?? 0) || 0
      const target = Number(q) || 1
      const capped = stock > 0 ? Math.min(target, stock) : target
      return { ...it, quantity: Math.max(1, capped) }
    })
  )
  const clear = () => setItems([])

  const total = useMemo(() => items.reduce((acc, it) => acc + Number(it.product.price) * it.quantity, 0), [items])

  return <CartCtx.Provider value={{ items, add, remove, setQty, clear, total }}>{children}</CartCtx.Provider>
}
export const useCart = () => useContext(CartCtx)
