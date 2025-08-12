import { useEffect, useState } from 'react'
import { apiRequest } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

const statuses = ['pending','paid','shipped','delivered','cancelled']

export default function AdminOrders() {
  const { token } = useAuth()
  const [items, setItems] = useState([])

  const load = async () => {
    const data = await apiRequest('/orders?all=true', { token })
    setItems(data.items)
  }

  useEffect(() => { if (token) load() }, [token])

  const updateStatus = async (id, status) => {
    await apiRequest(`/orders/${id}/status`, { method: 'PUT', token, body: { status } })
    await load()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin Orders</h1>
      <div className="grid gap-2">
        {items.map(o => (
          <div key={o.id} className="bg-white rounded p-3 shadow flex items-center justify-between">
            <div>
              <div className="font-medium">Order #{o.id}</div>
              <div className="text-gray-600">Status: {o.status}</div>
            </div>
            <select value={o.status} onChange={e=>updateStatus(o.id, e.target.value)} className="border rounded px-2 py-1">
              {statuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  )
}