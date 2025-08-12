import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiRequest } from '../api/client'

export default function Orders() {
  const { token } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (token) apiRequest('/orders', { token }).then(d => setItems(d.items))
  }, [token])

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Orders</h1>
      <div className="grid gap-3">
        {items.map(o => (
          <div key={o.id} className="bg-white rounded p-3 shadow flex items-center justify-between">
            <div>
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-gray-600">Status: {o.status}</div>
            </div>
            <div>
              <Link to={`/orders/${o.id}`} className="px-3 py-1 bg-gray-200 rounded">Details</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}