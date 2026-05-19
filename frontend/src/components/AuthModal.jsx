import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

function InputField({ icon: Icon, type, placeholder, value, onChange, toggle, showToggle }) {
  return (
    <div className="relative">
      <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-matte-black/30 pointer-events-none" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete="off"
        className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-gray-200 text-sm text-matte-black placeholder-matte-black/30 focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-transparent transition-all duration-200 bg-white"
      />
      {showToggle && (
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-matte-black/30 hover:text-matte-black/60 transition-colors"
        >
          {type === 'password' ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
      )}
    </div>
  )
}

function LoginForm({ onSwitch }) {
  const login = useAuthStore((s) => s.login)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Completá todos los campos.'); return }
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (!result.ok) { setError(result.error); return }
    const user = useAuthStore.getState().currentUser
    if (user?.role === 'ADMIN') navigate('/admin/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <InputField icon={Mail} type="email" placeholder="tu@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Contraseña"
          value={password} onChange={(e) => setPassword(e.target.value)}
          toggle={() => setShowPw(!showPw)} showToggle />
      </div>

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl"
          >
            <AlertCircle size={14} className="flex-shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center py-3.5 rounded-xl bg-olive-600 hover:bg-olive-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-olive-600/25"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : 'Iniciar sesión'}
      </button>

      <p className="text-center text-sm text-matte-black/50">
        ¿No tenés cuenta?{' '}
        <button type="button" onClick={onSwitch} className="text-olive-600 font-semibold hover:underline">
          Registrate
        </button>
      </p>
    </form>
  )
}

function RegisterForm({ onSwitch }) {
  const register = useAuthStore((s) => s.register)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!name.trim() || !email || !password || !confirm) {
      setError('Completá todos los campos.'); return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.'); return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.'); return
    }
    setLoading(true)
    const result = await register(name, email, password)
    if (!result.ok) setError(result.error)
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <InputField icon={User} type="text" placeholder="Tu nombre completo"
          value={name} onChange={(e) => setName(e.target.value)} />
        <InputField icon={Mail} type="email" placeholder="tu@email.com"
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Contraseña (mín. 6 caracteres)"
          value={password} onChange={(e) => setPassword(e.target.value)}
          toggle={() => setShowPw(!showPw)} showToggle />
        <InputField icon={Lock} type={showPw ? 'text' : 'password'} placeholder="Confirmar contraseña"
          value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>

      {/* Password strength indicator */}
      {password && (
        <div className="flex gap-1 -mt-1">
          {[1, 2, 3].map((lvl) => {
            const strength = password.length >= 10 ? 3 : password.length >= 6 ? 2 : 1
            return (
              <div key={lvl} className={`flex-1 h-1 rounded-full transition-colors duration-300 ${
                lvl <= strength
                  ? strength === 1 ? 'bg-red-400' : strength === 2 ? 'bg-sand-400' : 'bg-olive-500'
                  : 'bg-gray-200'
              }`} />
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl"
          >
            <AlertCircle size={14} className="flex-shrink-0" /> {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center py-3.5 rounded-xl bg-olive-600 hover:bg-olive-700 text-white font-semibold text-sm transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-olive-600/25"
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : 'Crear cuenta'}
      </button>

      <p className="text-center text-sm text-matte-black/50">
        ¿Ya tenés cuenta?{' '}
        <button type="button" onClick={onSwitch} className="text-olive-600 font-semibold hover:underline">
          Iniciá sesión
        </button>
      </p>
    </form>
  )
}

export default function AuthModal() {
  const modalOpen = useAuthStore((s) => s.modalOpen)
  const modalTab  = useAuthStore((s) => s.modalTab)
  const closeModal = useAuthStore((s) => s.closeModal)
  const setModalTab = useAuthStore((s) => s.setModalTab)

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [closeModal])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [modalOpen])

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={closeModal}
          className="fixed inset-0 z-50 bg-matte-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Top decoration */}
            <div className="h-1.5 bg-gradient-to-r from-olive-600 via-sand-500 to-leather-500" />

            <div className="p-7">
              {/* Header */}
              <div className="flex items-start justify-between mb-7">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-7 h-7 rounded-full bg-olive-600 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <span className="font-serif font-bold text-matte-black tracking-wider text-sm">MATES ACE</span>
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-matte-black mt-2">
                    {modalTab === 'login' ? 'Bienvenido de vuelta' : 'Creá tu cuenta'}
                  </h2>
                  <p className="text-matte-black/40 text-sm mt-0.5">
                    {modalTab === 'login'
                      ? 'Ingresá para ver tus pedidos y favoritos.'
                      : 'Registrate para una mejor experiencia de compra.'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-matte-black/50 hover:text-matte-black transition-colors flex-shrink-0 mt-1"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Tab switcher */}
              <div className="flex bg-gray-100 rounded-xl p-1 mb-6 relative">
                <motion.div
                  className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm"
                  animate={{ left: modalTab === 'login' ? '4px' : 'calc(50%)' }}
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
                {['login', 'register'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setModalTab(tab)}
                    className={`relative flex-1 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 z-10 ${
                      modalTab === tab ? 'text-matte-black' : 'text-matte-black/40 hover:text-matte-black/60'
                    }`}
                  >
                    {tab === 'login' ? 'Ingresar' : 'Registrarse'}
                  </button>
                ))}
              </div>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={modalTab}
                  initial={{ opacity: 0, x: modalTab === 'login' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: modalTab === 'login' ? 10 : -10 }}
                  transition={{ duration: 0.18 }}
                >
                  {modalTab === 'login'
                    ? <LoginForm onSwitch={() => setModalTab('register')} />
                    : <RegisterForm onSwitch={() => setModalTab('login')} />
                  }
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
