import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  User, Package, Heart, LogOut, Edit2, Check, X,
  ShoppingBag, ChevronRight, Calendar
} from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'
import { useOrdersStore } from '../store/useOrdersStore'
import { useWishlistStore } from '../store/useWishlistStore'
import { useAdminStore } from '../store/useAdminStore'
import { PRODUCTS, formatPrice } from '../data/products'
import clsx from 'clsx'

const STATUS = {
  pendiente:  { label: 'Pendiente',  cls: 'bg-sand-100 text-sand-700' },
  completado: { label: 'Completado', cls: 'bg-green-100 text-green-700' },
  enviado:    { label: 'Enviado',    cls: 'bg-blue-100 text-blue-700' },
}

const CHANNEL = {
  mercadopago: 'Mercado Pago',
  whatsapp:    'WhatsApp',
}

function Avatar({ name, size = 'lg' }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const cls = size === 'lg'
    ? 'w-20 h-20 text-2xl'
    : 'w-10 h-10 text-sm'

  return (
    <div className={`${cls} rounded-full bg-gradient-to-br from-olive-500 to-olive-700 flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {initials}
    </div>
  )
}

export default function ProfilePage() {
  const currentUser      = useAuthStore((s) => s.currentUser)
  const token            = useAuthStore((s) => s.token)
  const logout           = useAuthStore((s) => s.logout)
  const updateName       = useAuthStore((s) => s.updateName)
  const orders           = useOrdersStore((s) => s.orders)
  const fetchMyOrders    = useOrdersStore((s) => s.fetchMyOrders)
  const wishlistIds      = useWishlistStore((s) => s.items)
  const fetchWishlist    = useWishlistStore((s) => s.fetchWishlist)
  const adminProducts    = useAdminStore((s) => s.adminProducts)
  const allProducts      = [...PRODUCTS, ...adminProducts]
  const wishlist         = wishlistIds.map((id) => allProducts.find((p) => String(p.id) === String(id))).filter(Boolean)

  const [tab, setTab] = useState('orders')
  const [editingName, setEditingName] = useState(false)
  const [nameInput, setNameInput] = useState(currentUser?.name || '')
  const [expandedOrder, setExpandedOrder] = useState(null)

  useEffect(() => {
    if (token) {
      fetchMyOrders(token)
      fetchWishlist(token)
    }
  }, [token])

  if (!currentUser) return <Navigate to="/" replace />

  // orders ya están filtradas por usuario desde el endpoint /orders/mine
  const userOrders = orders

  const handleSaveName = async () => {
    if (nameInput.trim()) await updateName(nameInput.trim())
    setEditingName(false)
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-matte-black pt-32 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-6"
          >
            <Avatar name={currentUser.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                {editingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditingName(false) }}
                      className="font-serif text-2xl font-bold bg-white/10 border border-white/20 text-white rounded-lg px-3 py-1 focus:outline-none focus:border-olive-400 max-w-xs"
                    />
                    <button onClick={handleSaveName} className="w-8 h-8 rounded-lg bg-olive-600 flex items-center justify-center text-white hover:bg-olive-500 transition-colors">
                      <Check size={14} />
                    </button>
                    <button onClick={() => setEditingName(false)} className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">{currentUser.name}</h1>
                    <button
                      onClick={() => { setNameInput(currentUser.name); setEditingName(true) }}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/30 hover:text-white/60 transition-colors"
                    >
                      <Edit2 size={13} />
                    </button>
                  </>
                )}
              </div>
              <p className="text-white/40 text-sm mt-1">{currentUser.email}</p>
              <div className="flex items-center gap-4 mt-3">
                <span className="text-white/30 text-xs">{userOrders.length} pedido{userOrders.length !== 1 ? 's' : ''}</span>
                <span className="text-white/10">·</span>
                <span className="text-white/30 text-xs">{wishlistIds.length} favorito{wishlistIds.length !== 1 ? 's' : ''}</span>
                <span className="text-white/10">·</span>
                <span className="text-white/30 text-xs">
                  Miembro desde {new Date(currentUser.createdAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-white/40 hover:text-white hover:border-white/20 text-sm transition-all duration-200"
            >
              <LogOut size={14} />
              Salir
            </button>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {[
              { key: 'orders',   label: 'Mis pedidos',   icon: Package,     count: userOrders.length },
              { key: 'wishlist', label: 'Favoritos',     icon: Heart,       count: wishlist.length },
              { key: 'account',  label: 'Mi cuenta',     icon: User,        count: null },
            ].map(({ key, label, icon: Icon, count }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={clsx(
                  'flex items-center gap-2 py-4 text-sm font-medium border-b-2 -mb-px transition-all duration-200',
                  tab === key
                    ? 'border-olive-600 text-olive-600'
                    : 'border-transparent text-matte-black/40 hover:text-matte-black'
                )}
              >
                <Icon size={15} />
                {label}
                {count !== null && count > 0 && (
                  <span className={clsx(
                    'px-1.5 py-0.5 rounded-full text-[10px] font-bold',
                    tab === key ? 'bg-olive-100 text-olive-700' : 'bg-gray-100 text-matte-black/40'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* ── Orders ─────────────────────────────────────────────────────── */}
        {tab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {userOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-olive-50 flex items-center justify-center">
                  <ShoppingBag size={32} className="text-olive-200" />
                </div>
                <h3 className="font-serif text-xl font-bold text-matte-black">Todavía no hiciste pedidos</h3>
                <p className="text-matte-black/40 text-sm max-w-xs">
                  Cuando confirmes tu primera compra, vas a verla acá.
                </p>
                <Link to="/shop" className="btn-primary mt-2">
                  Explorar tienda <ChevronRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {userOrders.map((order) => {
                  const st = STATUS[order.status] || STATUS.pendiente
                  const date = new Date(order.date)
                  const isOpen = expandedOrder === order.id
                  return (
                    <motion.div
                      key={order.id}
                      layout
                      className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                      {/* Order header */}
                      <button
                        onClick={() => setExpandedOrder(isOpen ? null : order.id)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left"
                      >
                        <div className="flex items-center gap-4 flex-wrap">
                          <span className="font-mono text-xs text-matte-black/30">#{order.id}</span>
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${st.cls}`}>
                            {st.label}
                          </span>
                          <div className="flex items-center gap-1.5 text-matte-black/40 text-xs">
                            <Calendar size={11} />
                            {date.toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                          </div>
                          <span className="text-xs text-matte-black/30">{CHANNEL[order.channel] || order.channel}</span>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="font-bold text-matte-black">{formatPrice(order.total)}</span>
                          <ChevronRight size={15} className={`text-matte-black/30 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                        </div>
                      </button>

                      {/* Order items */}
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="border-t border-gray-100 px-6 py-4"
                        >
                          <div className="flex flex-col gap-3">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex items-center gap-4">
                                <div className="w-12 h-14 rounded-xl bg-sand-100 flex-shrink-0 overflow-hidden">
                                  <img
                                    src={`https://picsum.photos/seed/ord-${item.productId}/200/240`}
                                    alt={item.productName}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-matte-black leading-snug line-clamp-1">
                                    {item.productName}
                                  </p>
                                  {item.variant && (
                                    <p className="text-xs text-matte-black/40 mt-0.5">{item.variant}</p>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <p className="text-sm font-semibold text-matte-black">{formatPrice(item.subtotal)}</p>
                                  <p className="text-xs text-matte-black/40">×{item.quantity}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Wishlist ────────────────────────────────────────────────────── */}
        {tab === 'wishlist' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center">
                  <Heart size={32} className="text-red-200" />
                </div>
                <h3 className="font-serif text-xl font-bold text-matte-black">Sin favoritos todavía</h3>
                <p className="text-matte-black/40 text-sm">Guardá los productos que te gustan para encontrarlos fácil.</p>
                <Link to="/shop" className="btn-primary mt-2">Explorar tienda <ChevronRight size={14} /></Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                {wishlist.map((product) => (
                  <Link
                    key={product.id}
                    to={`/producto/${product.slug}`}
                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <div className="aspect-product bg-sand-50 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = `https://picsum.photos/seed/wl-${product.id}/300/400` }}
                      />
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-matte-black/40 uppercase tracking-wider mb-1">{product.category}</p>
                      <p className="text-sm font-medium text-matte-black line-clamp-2 group-hover:text-olive-700 transition-colors">{product.name}</p>
                      <p className="font-bold text-matte-black mt-2">{formatPrice(product.price)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ── Account ─────────────────────────────────────────────────────── */}
        {tab === 'account' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
            className="max-w-md flex flex-col gap-5"
          >
            <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-4">
              <h2 className="font-semibold text-matte-black">Datos de la cuenta</h2>
              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-matte-black/50">Nombre</span>
                  <span className="font-medium text-matte-black">{currentUser.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-matte-black/50">Email</span>
                  <span className="font-medium text-matte-black">{currentUser.email}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-matte-black/50">Miembro desde</span>
                  <span className="font-medium text-matte-black">
                    {new Date(currentUser.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>
              </div>
              <button
                onClick={() => { setNameInput(currentUser.name); setEditingName(true); setTab('orders') }}
                className="flex items-center gap-2 text-sm text-olive-600 hover:text-olive-700 font-medium transition-colors self-start"
              >
                <Edit2 size={13} /> Editar nombre
              </button>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border-2 border-red-100 text-red-500 hover:bg-red-50 text-sm font-medium transition-all duration-200 self-start"
            >
              <LogOut size={15} /> Cerrar sesión
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
