import { useEffect, useState } from 'react'
import { apiRequest } from '../api/client'
import ProductCard from '../components/ProductCard'

export default function ProductList() {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [categories, setCategories] = useState([])

  const load = async () => {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    const data = await apiRequest(`/products?${params.toString()}`)
    setItems(data.items)
  }

  useEffect(() => { apiRequest('/categories').then(d => setCategories(d.items)) }, [])
  useEffect(() => { load() }, [])

  return (
    <div>
      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input placeholder="Search" value={q} onChange={e=>setQ(e.target.value)} className="border rounded px-3 py-2"/>
        <select value={category} onChange={e=>setCategory(e.target.value)} className="border rounded px-3 py-2">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
        </select>
        <input placeholder="Min Price" value={minPrice} onChange={e=>setMinPrice(e.target.value)} className="border rounded px-3 py-2"/>
        <input placeholder="Max Price" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} className="border rounded px-3 py-2"/>
        <button onClick={load} className="px-3 py-2 bg-gray-800 text-white rounded">Apply</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}