import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, MapPin, Mail, CreditCard, AlertCircle } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'
import { formatPrice } from '../data/products'

function Field({ icon: Icon, placeholder, value, onChange, type = 'text' }) {
  return (
    <div className="relative">
      <Icon size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-matte-black/30 pointer-events-none" />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 text-sm text-matte-black placeholder-matte-black/30 focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-transparent transition-all"
      />
    </div>
  )
}

export default function CheckoutModal({ open, onClose }) {
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const closeCart = useCartStore((s) => s.closeCart)
  const token = useAuthStore((s) => s.token)
  const currentUser = useAuthStore((s) => s.currentUser)

  const [form, setForm] = useState({
    email: currentUser?.email ?? '',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const filled = Object.values(form).every((v) => v.trim().length > 0)

  const handlePay = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/checkout/mp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            name: i.product.name,
            productId: String(i.product.id),
            quantity: i.quantity,
            unitPrice: i.product.price,
            variant: i.variant?.value ?? null,
          })),
          shippingEmail: form.email,
          shippingFirstName: form.firstName,
          shippingLastName: form.lastName,
          shippingPhone: form.phone,
          shippingAddress: form.address,
        }),
      })
      const data = await res.json()
      if (data.url) {
        clearCart()
        closeCart()
        onClose()
        window.location.href = data.url
      } else {
        setError('No se pudo conectar con MercadoPago.')
      }
    } catch {
      setError('Error al procesar el pago. Intentá de nuevo.')
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-matte-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Top bar */}
            <div className="h-1.5 bg-gradient-to-r from-olive-600 via-sand-500 to-leather-500" />

            <div className="p-7">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-serif text-2xl font-bold text-matte-black">Datos de envío</h2>
                  <p className="text-matte-black/40 text-sm mt-0.5">Completá tus datos para continuar con el pago.</p>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-matte-black/50 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form */}
              <div className="flex flex-col gap-3 mb-6">
                <Field icon={Mail} placeholder="Email" value={form.email} onChange={set('email')} type="email" />
                <div className="grid grid-cols-2 gap-3">
                  <Field icon={User} placeholder="Nombre" value={form.firstName} onChange={set('firstName')} />
                  <Field icon={User} placeholder="Apellido" value={form.lastName} onChange={set('lastName')} />
                </div>
                <Field icon={Phone} placeholder="Número de celular" value={form.phone} onChange={set('phone')} type="tel" />
                <Field icon={MapPin} placeholder="Dirección completa" value={form.address} onChange={set('address')} />
              </div>

              {/* Order summary */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-matte-black/40 mb-3">Resumen del pedido</p>
                <div className="flex flex-col gap-1.5">
                  {items.map((i) => (
                    <div key={i.key} className="flex justify-between text-sm">
                      <span className="text-matte-black/60 truncate pr-4">{i.product.name} ×{i.quantity}</span>
                      <span className="text-matte-black font-medium flex-shrink-0">{formatPrice(i.product.price * i.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 mt-2 pt-2 flex justify-between font-bold text-matte-black">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl mb-4"
                  >
                    <AlertCircle size={14} className="flex-shrink-0" /> {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Pay button */}
              <button
                onClick={handlePay}
                disabled={!filled || loading}
                className="w-full flex items-center justify-center gap-2 bg-[#009ee3] hover:bg-[#008bc9] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard size={16} />
                    Pagar con Mercado Pago
                  </>
                )}
              </button>

              {!filled && (
                <p className="text-center text-xs text-matte-black/30 mt-3">
                  Completá todos los campos para habilitar el pago
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
