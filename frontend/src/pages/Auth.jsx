import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Auth() {
  const { login, signup, loading } = useAuth()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await signup(name, email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow p-6 rounded">
      <div className="flex gap-3 mb-4">
        <button className={`px-3 py-1 rounded ${mode==='login'?'bg-sky-600 text-white':'bg-gray-200'}`} onClick={()=>setMode('login')}>Login</button>
        <button className={`px-3 py-1 rounded ${mode==='signup'?'bg-sky-600 text-white':'bg-gray-200'}`} onClick={()=>setMode('signup')}>Sign Up</button>
      </div>
      <form onSubmit={submit} className="grid gap-3">
        {mode==='signup' && (
          <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} className="border rounded px-3 py-2" required />
        )}
        <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="border rounded px-3 py-2" required />
        <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} className="border rounded px-3 py-2" required />
        <button disabled={loading} className="px-4 py-2 bg-sky-600 text-white rounded disabled:opacity-50">{loading ? 'Please wait...' : (mode==='login'?'Login':'Create Account')}</button>
        {error && <div className="text-red-600">{error}</div>}
      </form>
    </div>
  )
}