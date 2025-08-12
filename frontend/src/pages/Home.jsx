import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Welcome to SmartShop</h1>
      <p className="mt-2 text-gray-600">Discover great products and deals.</p>
      <Link to="/products" className="inline-block mt-6 px-6 py-3 bg-sky-600 text-white rounded">Shop Now</Link>
    </div>
  )
}