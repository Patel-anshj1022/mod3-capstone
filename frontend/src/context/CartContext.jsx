import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { apiRequest } from '../api/client'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { token } = useAuth()
  const [items, setItems] = useState(() => {
    const cached = localStorage.getItem('cart')
    return cached ? JSON.parse(cached) : []
  })

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(items)) }, [items])

  useEffect(() => {
    if (token) {
      apiRequest('/cart', { token }).then((data) => {
        setItems(data.items.map(ci => ({ productId: ci.product.id, quantity: ci.quantity, product: ci.product })))
      }).catch(() => {})
    }
  }, [token])

  const sync = async (newItems) => {
    setItems(newItems)
    if (token) {
      await apiRequest('/cart', { method: 'POST', token, body: { items: newItems.map(({ productId, quantity }) => ({ productId, quantity })) } })
    }
  }

  const add = (product, quantity = 1) => {
    const idx = items.findIndex(i => i.productId === product.id)
    const newItems = [...items]
    if (idx >= 0) newItems[idx] = { ...newItems[idx], quantity: newItems[idx].quantity + quantity }
    else newItems.push({ productId: product.id, quantity, product })
    sync(newItems)
  }
  const remove = (productId) => sync(items.filter(i => i.productId !== productId))
  const clear = () => sync([])
  const updateQty = (productId, quantity) => sync(items.map(i => i.productId === productId ? { ...i, quantity } : i))

  return (
    <CartContext.Provider value={{ items, add, remove, clear, updateQty }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() { return useContext(CartContext) }