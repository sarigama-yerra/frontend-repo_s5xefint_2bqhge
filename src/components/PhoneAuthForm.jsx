import { useEffect, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function PhoneAuthForm() {
  const [step, setStep] = useState('phone') // phone | code | password | done
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  const start = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${BACKEND}/auth/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      })
      if (!res.ok) throw new Error((await res.json()).detail || 'Failed to send code')
      setStep('code')
    } catch (e) {
      setError(e.message)
    } finally { setLoading(false) }
  }

  const verify = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${BACKEND}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Verification failed')
      if (data.need_password) {
        setStep('password')
      } else {
        setUser(data.user)
        setStep('done')
      }
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const verifyPassword = async () => {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${BACKEND}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, password })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Verification failed')
      setUser(data.user)
      setStep('done')
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md w-full mx-auto bg-slate-800/60 border border-blue-500/20 rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Telegram Phone Sign-In</h2>
      {error && <div className="text-red-400 text-sm mb-3">{error}</div>}

      {step === 'phone' && (
        <div className="space-y-3">
          <input
            className="w-full rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 text-white outline-none focus:border-blue-500"
            placeholder="e.g. +998901234567"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
          <button onClick={start} disabled={loading || !phone}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg py-2 transition">
            {loading ? 'Sending...' : 'Send Code'}
          </button>
        </div>
      )}

      {step === 'code' && (
        <div className="space-y-3">
          <input
            className="w-full rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 text-white tracking-widest text-center outline-none focus:border-blue-500"
            placeholder="5-digit code"
            value={code}
            onChange={e => setCode(e.target.value)}
            maxLength={6}
          />
          <button onClick={verify} disabled={loading || code.length < 3}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg py-2 transition">
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      )}

      {step === 'password' && (
        <div className="space-y-3">
          <input
            type="password"
            className="w-full rounded-lg bg-slate-900/70 border border-slate-700 px-3 py-2 text-white outline-none focus:border-blue-500"
            placeholder="Enter 2FA password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button onClick={verifyPassword} disabled={loading || !password}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg py-2 transition">
            {loading ? 'Verifying...' : 'Verify Password'}
          </button>
        </div>
      )}

      {step === 'done' && user && (
        <div className="text-blue-100">
          <div className="mb-2">Signed in as:</div>
          <div className="font-medium">{user.first_name} {user.last_name}</div>
          <div className="text-sm text-blue-300">@{user.username} • ID: {user.id}</div>
        </div>
      )}
    </div>
  )
}
