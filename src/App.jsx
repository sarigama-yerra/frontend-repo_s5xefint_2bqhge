import PhoneAuthForm from './components/PhoneAuthForm'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="max-w-2xl w-full space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Telegram Auth</h1>
            <p className="text-blue-200">Sign in with your phone. We'll send a code via Telegram, handle 2FA if needed, and save your session securely.</p>
          </div>

          <PhoneAuthForm />

          <div className="text-center text-sm text-blue-300/60">
            Your session is stored securely on the server. You can close this tab after signing in.
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
