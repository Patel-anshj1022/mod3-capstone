import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, updateQty, remove, clear } = useCart()
  const navigate = useNavigate()
  const total = items.reduce((sum, i) => sum + (Number(i.product?.price || 0) * i.quantity), 0).toFixed(2)

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
      {items.length === 0 ? (
        <div>Cart is empty. <Link to="/products" className="underline">Shop products</Link></div>
      ) : (
        <div className="grid gap-3">
          {items.map(i => (
            <div key={i.productId} className="flex items-center justify-between bg-white rounded p-3 shadow">
              <div className="flex items-center gap-3">
                <img src={i.product?.image_url || 'https://via.placeholder.com/80x80?text=.'} alt="" className="w-16 h-16 object-cover rounded"/>
                <div>
                  <div className="font-medium">{i.product?.title || `#${i.productId}`}</div>
                  <div className="text-gray-600">${i.product?.price}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min="1" value={i.quantity} onChange={(e)=>updateQty(i.productId, Number(e.target.value))} className="w-20 border rounded px-2 py-1"/>
                <button onClick={()=>remove(i.productId)} className="px-3 py-1 bg-gray-200 rounded">Remove</button>
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between mt-2">
            <div className="text-lg">Total: <span className="font-semibold">${total}</span></div>
            <div className="flex items-center gap-2">
              <button onClick={clear} className="px-3 py-2 bg-gray-200 rounded">Clear</button>
              <button onClick={()=>navigate('/checkout')} className="px-3 py-2 bg-sky-600 text-white rounded">Checkout</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}