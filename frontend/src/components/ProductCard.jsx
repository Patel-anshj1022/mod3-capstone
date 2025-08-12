import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { add } = useCart()
  return (
    <div className="bg-white rounded shadow p-4 flex flex-col">
      <img src={product.image_url || 'https://via.placeholder.com/300x200?text=Product'} alt="" className="w-full h-40 object-cover rounded"/>
      <Link to={`/products/${product.id}`} className="mt-3 font-medium hover:underline">{product.title}</Link>
      <div className="mt-1 text-gray-600">${product.price}</div>
      <button onClick={() => add(product, 1)} className="mt-3 px-3 py-2 bg-sky-500 text-white rounded">Add to Cart</button>
    </div>
  )
}