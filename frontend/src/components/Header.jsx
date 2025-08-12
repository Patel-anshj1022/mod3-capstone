import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Header() {
  const { user, logout } = useAuth()
  const { items } = useCart()
  const navigate = useNavigate()

  const onLogout = async () => { await logout(); navigate('/') }

  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold text-sky-600">SmartShop</Link>
        <nav className="flex items-center gap-4">
          <Link to="/products" className="hover:underline">Products</Link>
          <Link to="/cart" className="hover:underline">Cart ({items.reduce((a,b)=>a+b.quantity,0)})</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/orders" className="hover:underline">Orders</Link>
              {user.role === 'admin' && (
                <>
                  <Link to="/admin/products" className="hover:underline">Admin Products</Link>
                  <Link to="/admin/orders" className="hover:underline">Admin Orders</Link>
                </>
              )}
              <span className="text-gray-600">Hi, {user.name}</span>
              <button onClick={onLogout} className="px-3 py-1 bg-gray-200 rounded">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="px-3 py-1 bg-sky-500 text-white rounded">Login</Link>
          )}
        </nav>
      </div>
    </header>
  )
}