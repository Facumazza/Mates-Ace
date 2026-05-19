import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, User, Phone, MapPin, Mail, CreditCard, AlertCircle, Landmark, Copy, Check, CheckCircle2 } from 'lucide-react'
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

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-0">
      <span className="text-matte-black/50 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-matte-black font-semibold text-sm font-mono">{value}</span>
        {value && (
          <button onClick={handleCopy} className="text-matte-black/30 hover:text-olive-600 transition-colors">
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          </button>
        )}
      </div>
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
  const [paymentMethod, setPaymentMethod] = useState('mp')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [transferResult, setTransferResult] = useState(null)

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const filled = Object.values(form).every((v) => v.trim().length > 0)

  const buildItems = () => items.map((i) => ({
    name: i.product.name,
    productId: String(i.product.id),
    quantity: i.quantity,
    unitPrice: i.product.price,
    variant: i.variant?.value ?? null,
  }))

  const buildShipping = () => ({
    shippingEmail: form.email,
    shippingFirstName: form.firstName,
    shippingLastName: form.lastName,
    shippingPhone: form.phone,
    shippingAddress: form.address,
  })

  const handlePay = async () => {
    setError('')
    setLoading(true)
    try {
      if (paymentMethod === 'mp') {
        const res = await fetch('/api/checkout/mp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ items: buildItems(), ...buildShipping() }),
        })
        const data = await res.json()
        if (data.url) {
          clearCart()
          closeCart()
          onClose()
          window.location.href = data.url
        } else {
          setError(data.error || 'No se pudo conectar con MercadoPago.')
        }
      } else {
        const res = await fetch('/api/checkout/transferencia', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ items: buildItems(), ...buildShipping() }),
        })
        const data = await res.json()
        if (data.orderId) {
          clearCart()
          closeCart()
          setTransferResult(data)
        } else {
          setError(data.error || 'No se pudo crear el pedido.')
        }
      }
    } catch {
      setError('Error al procesar el pedido. Intentá de nuevo.')
    }
    setLoading(false)
  }

  const handleClose = () => {
    setTransferResult(null)
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 z-[60] bg-matte-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative"
          >
            {/* Top bar */}
            <div className="h-1.5 bg-gradient-to-r from-olive-600 via-sand-500 to-leather-500" />

            <div className="p-7">
              {transferResult ? (
                /* ── Transfer success screen ── */
                <TransferSuccess result={transferResult} onClose={handleClose} />
              ) : (
                /* ── Checkout form ── */
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-matte-black">Datos de envío</h2>
                      <p className="text-matte-black/40 text-sm mt-0.5">Completá tus datos para continuar.</p>
                    </div>
                    <button
                      onClick={handleClose}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-matte-black/50 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* Form */}
                  <div className="flex flex-col gap-3 mb-5">
                    <Field icon={Mail} placeholder="Email" value={form.email} onChange={setField('email')} type="email" />
                    <div className="grid grid-cols-2 gap-3">
                      <Field icon={User} placeholder="Nombre" value={form.firstName} onChange={setField('firstName')} />
                      <Field icon={User} placeholder="Apellido" value={form.lastName} onChange={setField('lastName')} />
                    </div>
                    <Field icon={Phone} placeholder="Número de celular" value={form.phone} onChange={setField('phone')} type="tel" />
                    <Field icon={MapPin} placeholder="Dirección completa" value={form.address} onChange={setField('address')} />
                  </div>

                  {/* Order summary */}
                  <div className="bg-gray-50 rounded-2xl p-4 mb-5">
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

                  {/* Payment method */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-matte-black/40 mb-3">Método de pago</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setPaymentMethod('mp')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                          paymentMethod === 'mp'
                            ? 'border-[#009ee3] bg-[#009ee3]/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard size={20} className={paymentMethod === 'mp' ? 'text-[#009ee3]' : 'text-matte-black/40'} />
                        <span className={`text-xs font-semibold ${paymentMethod === 'mp' ? 'text-[#009ee3]' : 'text-matte-black/50'}`}>
                          Mercado Pago
                        </span>
                      </button>
                      <button
                        onClick={() => setPaymentMethod('transferencia')}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                          paymentMethod === 'transferencia'
                            ? 'border-olive-600 bg-olive-600/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Landmark size={20} className={paymentMethod === 'transferencia' ? 'text-olive-600' : 'text-matte-black/40'} />
                        <span className={`text-xs font-semibold ${paymentMethod === 'transferencia' ? 'text-olive-600' : 'text-matte-black/50'}`}>
                          Transferencia
                        </span>
                      </button>
                    </div>
                    {paymentMethod === 'transferencia' && (
                      <p className="text-xs text-matte-black/40 mt-2 text-center">
                        Vas a recibir los datos bancarios para transferir el total.
                      </p>
                    )}
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

                  {/* Submit button */}
                  <button
                    onClick={handlePay}
                    disabled={!filled || loading}
                    className={`w-full flex items-center justify-center gap-2 text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none ${
                      paymentMethod === 'mp'
                        ? 'bg-[#009ee3] hover:bg-[#008bc9] shadow-blue-500/20'
                        : 'bg-olive-600 hover:bg-olive-500 shadow-olive-600/20'
                    }`}
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : paymentMethod === 'mp' ? (
                      <><CreditCard size={16} /> Pagar con Mercado Pago</>
                    ) : (
                      <><Landmark size={16} /> Confirmar pedido</>
                    )}
                  </button>

                  {!filled && (
                    <p className="text-center text-xs text-matte-black/30 mt-3">
                      Completá todos los campos para continuar
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function TransferSuccess({ result, onClose }) {
  const { orderId, total, bankInfo } = result
  return (
    <div className="flex flex-col items-center text-center gap-5">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-matte-black/50 transition-colors"
      >
        <X size={14} />
      </button>

      <div className="w-14 h-14 rounded-full bg-olive-600/10 flex items-center justify-center">
        <CheckCircle2 size={28} className="text-olive-600" />
      </div>

      <div>
        <h2 className="font-serif text-2xl font-bold text-matte-black">¡Pedido recibido!</h2>
        <p className="text-matte-black/50 text-sm mt-1">Pedido <strong className="text-matte-black">#{orderId}</strong></p>
      </div>

      <p className="text-matte-black/60 text-sm leading-relaxed">
        Realizá la transferencia con los datos de abajo. Una vez confirmado el pago, preparamos tu envío y te avisamos por email.
      </p>

      <div className="w-full bg-gray-50 rounded-2xl p-5 text-left">
        <p className="text-xs font-semibold uppercase tracking-wider text-matte-black/40 mb-3">Datos bancarios</p>
        {bankInfo?.bank   && <CopyField label="Banco"   value={bankInfo.bank} />}
        {bankInfo?.holder && <CopyField label="Titular" value={bankInfo.holder} />}
        {bankInfo?.cvu    && <CopyField label="CVU"     value={bankInfo.cvu} />}
        {bankInfo?.alias  && <CopyField label="Alias"   value={bankInfo.alias} />}
        <CopyField label="Referencia" value={`Pedido #${orderId}`} />
        <div className="flex items-center justify-between pt-3 mt-1 border-t border-gray-200">
          <span className="font-bold text-matte-black">Total a transferir</span>
          <span className="font-bold text-olive-600 text-lg">{formatPrice(total)}</span>
        </div>
      </div>

      <p className="text-xs text-matte-black/35">
        También te enviamos estos datos a tu email.
      </p>

      <button
        onClick={onClose}
        className="w-full py-3.5 rounded-2xl bg-olive-600 hover:bg-olive-500 text-white font-semibold text-sm transition-all duration-200"
      >
        Entendido
      </button>
    </div>
  )
}
