import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiRequest } from '../api/client'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { add } = useCart()

  useEffect(() => { apiRequest(`/products/${id}`).then(d => setProduct(d.product)) }, [id])
  if (!product) return <div>Loading...</div>
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <img src={product.image_url || 'https://via.placeholder.com/600x400?text=Product'} alt="" className="w-full rounded"/>
      <div>
        <h1 className="text-2xl font-semibold">{product.title}</h1>
        <div className="mt-2 text-gray-600">${product.price}</div>
        <p className="mt-3">{product.description}</p>
        <button onClick={() => add(product, 1)} className="mt-4 px-4 py-2 bg-sky-600 text-white rounded">Add to Cart</button>
      </div>
    </div>
  )
}