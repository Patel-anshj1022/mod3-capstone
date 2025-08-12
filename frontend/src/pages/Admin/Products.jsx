import { useEffect, useState } from 'react'
import { apiRequest } from '../../api/client'
import { useAuth } from '../../context/AuthContext'

export default function AdminProducts() {
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ id: null, title: '', price: '', category: '', inventory: 0 })

  const load = async () => {
    const data = await apiRequest('/products')
    setItems(data.items)
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    const body = { title: form.title, price: Number(form.price), category: form.category, inventory: Number(form.inventory) }
    if (form.id) {
      await apiRequest(`/products/${form.id}`, { method: 'PUT', token, body })
    } else {
      await apiRequest('/products', { method: 'POST', token, body })
    }
    setForm({ id: null, title: '', price: '', category: '', inventory: 0 })
    await load()
  }

  const edit = (p) => {
    setForm({ id: p.id, title: p.title, price: String(p.price), category: p.category?.name || '', inventory: p.inventory })
  }

  const del = async (id) => {
    await apiRequest(`/products/${id}`, { method: 'DELETE', token })
    await load()
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Admin Products</h1>
      <div className="bg-white rounded p-4 shadow mb-6 grid grid-cols-1 md:grid-cols-6 gap-2">
        <input placeholder="Title" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))} className="border rounded px-3 py-2"/>
        <input placeholder="Price" value={form.price} onChange={e=>setForm(f=>({...f,price:e.target.value}))} className="border rounded px-3 py-2"/>
        <input placeholder="Category" value={form.category} onChange={e=>setForm(f=>({...f,category:e.target.value}))} className="border rounded px-3 py-2"/>
        <input placeholder="Inventory" value={form.inventory} onChange={e=>setForm(f=>({...f,inventory:e.target.value}))} className="border rounded px-3 py-2"/>
        <button onClick={save} className="px-3 py-2 bg-green-600 text-white rounded">{form.id ? 'Update' : 'Add'}</button>
        {form.id && <button onClick={()=>setForm({ id: null, title: '', price: '', category: '', inventory: 0 })} className="px-3 py-2 bg-gray-200 rounded">Cancel</button>}
      </div>
      <div className="grid gap-2">
        {items.map(p => (
          <div key={p.id} className="bg-white rounded p-3 shadow flex items-center justify-between">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-gray-600">${p.price} • {p.category?.name || 'Uncategorized'} • Stock: {p.inventory}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={()=>edit(p)} className="px-3 py-1 bg-blue-600 text-white rounded">Edit</button>
              <button onClick={()=>del(p.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}