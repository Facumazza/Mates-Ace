import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { X, ShoppingBag, Plus, Minus, Trash2, MessageCircle } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { useOrdersStore } from '../store/useOrdersStore'
import { useAuthStore } from '../store/useAuthStore'
import { formatPrice } from '../data/products'
import CheckoutModal from './CheckoutModal'

export default function CartSidebar() {
  const isOpen = useCartStore((s) => s.isOpen)
  const closeCart = useCartStore((s) => s.closeCart)
  const items = useCartStore((s) => s.items)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const clearCart = useCartStore((s) => s.clearCart)
  const addOrder = useOrdersStore((s) => s.addOrder)
  const currentUser = useAuthStore((s) => s.currentUser)
  const token = useAuthStore((s) => s.token)

  const [checkoutOpen, setCheckoutOpen] = useState(false)

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const handleCheckoutWsp = () => {
    if (token) addOrder(items, total, 'whatsapp', token).catch(() => {})
    const msg = encodeURIComponent(
      `Hola! Quiero realizar el siguiente pedido:\n\n` +
      items.map((i) => `• ${i.product.name} x${i.quantity} — ${formatPrice(i.product.price * i.quantity)}`).join('\n') +
      `\n\nTotal: ${formatPrice(total)}`
    )
    window.open(`https://wa.me/5491112345678?text=${msg}`, '_blank')
    clearCart()
    closeCart()
  }

  return (
    <>
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-matte-black/50 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-olive-600" />
                <h2 className="font-serif text-xl font-bold text-matte-black">Mi Carrito</h2>
                {itemCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-olive-600 text-white text-xs flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 py-20"
                  >
                    <div className="w-20 h-20 rounded-full bg-olive-50 flex items-center justify-center">
                      <ShoppingBag size={32} className="text-olive-300" />
                    </div>
                    <div className="text-center">
                      <p className="font-serif text-xl font-semibold text-matte-black">Tu carrito está vacío</p>
                      <p className="text-matte-black/40 text-sm mt-1">Explorá nuestra colección de mates premium</p>
                    </div>
                    <button
                      onClick={closeCart}
                      className="btn-primary mt-2"
                    >
                      Ver productos
                    </button>
                  </motion.div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.key}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex gap-4 p-3 rounded-2xl bg-warm-white"
                      >
                        {/* Product image */}
                        <Link to={`/producto/${item.product.slug}`} onClick={closeCart} className="flex-shrink-0">
                          <img
                            src={item.product.images[0]}
                            alt={item.product.name}
                            className="w-20 h-24 object-cover rounded-xl"
                            onError={(e) => { e.target.src = `https://picsum.photos/seed/cart-${item.product.id}/200/240` }}
                          />
                        </Link>

                        {/* Info */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <Link
                              to={`/producto/${item.product.slug}`}
                              onClick={closeCart}
                              className="font-medium text-sm text-matte-black leading-tight line-clamp-2 hover:text-olive-600 transition-colors"
                            >
                              {item.product.name}
                            </Link>
                            {item.variant && (
                              <p className="text-xs text-matte-black/40 mt-0.5">{item.variant.label}</p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity controls */}
                            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.key, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-matte-black/50 hover:text-matte-black hover:bg-gray-100 transition-colors"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.key, item.quantity + 1)}
                                className="w-7 h-7 flex items-center justify-center text-matte-black/50 hover:text-matte-black hover:bg-gray-100 transition-colors"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            {/* Price + Remove */}
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-matte-black">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                              <button
                                onClick={() => removeItem(item.key)}
                                className="text-matte-black/20 hover:text-red-400 transition-colors duration-200"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-6 py-5 flex flex-col gap-4">
                {/* Free shipping indicator */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-matte-black/50">Envío gratis a todo el país</span>
                  <span className="text-olive-600 font-semibold">✓ Incluido</span>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="font-medium text-matte-black/60">Total</span>
                  <div className="text-right">
                    <span className="font-bold text-2xl text-matte-black">{formatPrice(total)}</span>
                  </div>
                </div>

                {/* Checkout via Mercado Pago */}
                <button
                  onClick={() => setCheckoutOpen(true)}
                  className="w-full flex items-center justify-center gap-2 bg-[#009ee3] hover:bg-[#008bc9] text-white font-semibold py-4 rounded-2xl transition-colors duration-200 shadow-lg shadow-blue-500/20"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 6.628 5.374 12 12 12 6.629 0 12-5.372 12-12C24 5.373 18.629 0 12 0zm4.844 7.695l-1.477 6.885c-.113.51-.415.635-.84.394l-2.32-1.71-.32 1.618c-.04.186-.153.352-.306.445l-.027.016c-.105.063-.225.105-.356.105a.65.65 0 01-.39-.132l-2.083-1.626-1.246 1.2c-.138.133-.325.21-.525.21-.093 0-.187-.017-.275-.053l.284-1.915 4.848-4.374c.21-.19.014-.294-.325-.104L6.22 12.617l-1.872-.594c-.406-.13-.413-.404.086-.598l7.304-2.814c.34-.13.638.082.538.512-.062.27-.11.486-.145.646-.01.042-.018.08-.025.112z"/>
                  </svg>
                  Pagar con Mercado Pago
                </button>

                {/* WhatsApp checkout */}
                <button
                  onClick={handleCheckoutWsp}
                  className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fba57] text-white font-medium py-3 rounded-2xl transition-colors duration-200 text-sm"
                >
                  <MessageCircle size={16} />
                  Pedir por WhatsApp
                </button>

                {/* Clear */}
                <button
                  onClick={clearCart}
                  className="text-center text-xs text-matte-black/30 hover:text-red-400 transition-colors duration-200"
                >
                  Vaciar carrito
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
