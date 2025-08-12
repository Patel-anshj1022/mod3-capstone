import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../api/client'

export default function Checkout() {
  const { items, clear } = useCart()
  const { token, user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const placeOrder = async () => {
    if (!user) { setMessage('Please log in to checkout'); return }
    setLoading(true)
    try {
      const orderData = await apiRequest('/orders', { method: 'POST', token, body: { items: items.map(i => ({ productId: i.productId, quantity: i.quantity })) } })
      const orderId = orderData.order.id
      const res = await apiRequest('/checkout', { method: 'POST', token, body: { orderId } })
      setMessage(res.message)
      clear()
    } catch (e) {
      setMessage(e.message)
    } finally { setLoading(false) }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Checkout</h1>
      <p className="mb-4">Simulated payment: no real charges.</p>
      <button disabled={loading} onClick={placeOrder} className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50">{loading ? 'Processing...' : 'Place Order'}</button>
      {message && <div className="mt-3 text-green-700">{message}</div>}
    </div>
  )
}