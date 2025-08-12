import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../api/client'

export default function OrderDetail() {
  const { id } = useParams()
  const { token } = useAuth()
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (token) apiRequest(`/orders/${id}`, { token }).then(d => setOrder(d.order))
  }, [token, id])

  if (!order) return <div>Loading...</div>
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Order #{order.id}</h1>
      <div className="mb-2">Status: {order.status}</div>
      <div>Total: ${order.total_amount}</div>
      <div className="mt-4 grid gap-2">
        {order.items.map(item => (
          <div key={item.id} className="bg-white rounded p-3 shadow flex items-center justify-between">
            <div className="font-medium">{item.product.title}</div>
            <div>x{item.quantity}</div>
            <div>${item.unit_price}</div>
          </div>
        ))}
      </div>
    </div>
  )
}