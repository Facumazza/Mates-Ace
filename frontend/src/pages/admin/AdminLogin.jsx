import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((s) => s.login)
  const currentUser = useAuthStore((s) => s.currentUser)
  const navigate = useNavigate()

  // Si ya hay un admin logueado, redirigir directo
  if (currentUser?.role === 'ADMIN') {
    navigate('/admin/dashboard', { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const user = useAuthStore.getState().currentUser
    if (user?.role !== 'ADMIN') {
      useAuthStore.getState().logout()
      setError('No tenés permisos de administrador.')
      return
    }
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-matte-black flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-olive-900/20" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-olive-900/10" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="relative w-full max-w-sm"
      >
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-olive-600 flex items-center justify-center shadow-2xl shadow-olive-600/30">
            <span className="text-white text-2xl font-bold font-serif">M</span>
          </div>
          <div className="text-center">
            <h1 className="font-serif text-2xl font-bold text-white tracking-widest">MATES ACE</h1>
            <p className="text-white/30 text-xs tracking-widest uppercase mt-0.5">Panel de administración</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8">
          <h2 className="font-serif text-xl font-bold text-white mb-1">Iniciar sesión</h2>
          <p className="text-white/30 text-sm mb-7">Ingresá con tu cuenta de administrador.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  autoFocus required placeholder="admin@matesace.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-olive-500 transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-white/40">Contraseña</label>
              <div className="relative">
                <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-olive-500 transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={15} /> {error}
              </motion.div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-olive-600 hover:bg-olive-500 text-white font-semibold py-3.5 rounded-xl transition-all shadow-lg shadow-olive-600/20 text-sm disabled:opacity-60">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : 'Ingresar al panel'
              }
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
