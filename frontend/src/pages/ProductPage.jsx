import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart, ShoppingBag, Check, ChevronRight, ArrowLeft,
  Truck, Shield, RefreshCw, MessageCircle, Share2, Minus, Plus
} from 'lucide-react'
import { PRODUCTS, formatPrice } from '../data/products'
import { useCartStore } from '../store/useCartStore'
import { useWishlistStore } from '../store/useWishlistStore'
import { useAuthStore } from '../store/useAuthStore'
import ProductCard from '../components/ProductCard'
import clsx from 'clsx'

const BADGE_MAP = {
  bestseller: { label: 'Más vendido', cls: 'bg-olive-600 text-white' },
  new:        { label: 'Nuevo',        cls: 'bg-sand-500 text-white' },
  sale:       { label: 'Oferta',       cls: 'bg-red-500 text-white' },
}

export default function ProductPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const product = PRODUCTS.find((p) => p.slug === slug)

  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState('descripcion')

  const addItem = useCartStore((s) => s.addItem)
  const toggle = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => product && s.isWishlisted(product.id))
  const token = useAuthStore((s) => s.token)

  if (!product) {
    return (
      <div className="min-h-screen bg-warm-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🧉</p>
          <h1 className="font-serif text-3xl font-bold text-matte-black mb-3">Producto no encontrado</h1>
          <p className="text-matte-black/50 mb-6">Este producto no existe o fue removido.</p>
          <Link to="/shop" className="btn-primary">Ver todos los productos</Link>
        </div>
      </div>
    )
  }

  const related = PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

  const badge = product.badge ? BADGE_MAP[product.badge] : null
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hola! Me interesa el producto: ${product.name}${selectedVariant ? ` (${selectedVariant.label})` : ''} — ${formatPrice(product.price)}`
    )
    window.open(`https://wa.me/5491112345678?text=${msg}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-warm-white pt-20">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <nav className="flex items-center gap-2 text-sm text-matte-black/40">
          <Link to="/" className="hover:text-matte-black transition-colors">Inicio</Link>
          <ChevronRight size={12} />
          <Link to="/shop" className="hover:text-matte-black transition-colors">Shop</Link>
          <ChevronRight size={12} />
          <Link to={`/shop?categoria=${product.category}`} className="hover:text-matte-black transition-colors capitalize">{product.category}</Link>
          <ChevronRight size={12} />
          <span className="text-matte-black font-medium truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">

          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-4"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden bg-sand-50 aspect-square">
              <motion.img
                key={selectedImage}
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                onError={(e) => { e.target.src = `https://picsum.photos/seed/prod-detail-${product.id}/800/800` }}
              />

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {badge && (
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${badge.cls}`}>
                    {badge.label}
                  </span>
                )}
                {discount && (
                  <span className="px-3 py-1.5 rounded-full bg-red-500 text-white text-xs font-bold">
                    -{discount}%
                  </span>
                )}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => toggle(product, token)}
                className={clsx(
                  'absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg',
                  isWishlisted ? 'bg-red-50 text-red-500' : 'bg-white text-matte-black/40 hover:text-red-400'
                )}
              >
                <Heart size={16} className={isWishlisted ? 'fill-red-500' : ''} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={clsx(
                      'w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 flex-shrink-0',
                      selectedImage === i ? 'border-olive-500 scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                    )}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = `https://picsum.photos/seed/thumb-${product.id}-${i}/200/200` }} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Category + Name */}
            <div>
              <span className="text-olive-600 text-xs font-bold uppercase tracking-[0.2em]">{product.category}</span>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-matte-black leading-tight mt-2">
                {product.name}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="font-bold text-4xl text-matte-black">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-xl text-matte-black/30 line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            {/* Description */}
            <p className="text-matte-black/60 leading-relaxed text-sm">{product.description}</p>

            {/* Variants */}
            {product.variants && product.variants.length > 1 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-matte-black mb-3">
                  Variante{selectedVariant ? `: ${selectedVariant.label}` : ''}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.value}
                      onClick={() => v.available && setSelectedVariant(v)}
                      disabled={!v.available}
                      className={clsx(
                        'px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all duration-200',
                        !v.available && 'opacity-30 cursor-not-allowed line-through',
                        selectedVariant?.value === v.value
                          ? 'border-olive-600 bg-olive-50 text-olive-700'
                          : 'border-gray-200 text-matte-black hover:border-olive-400'
                      )}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3">
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center text-matte-black/40 hover:text-matte-black hover:bg-gray-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="w-12 text-center font-semibold text-matte-black">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center text-matte-black/40 hover:text-matte-black hover:bg-gray-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className={clsx(
                  'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300',
                  added
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                    : 'bg-olive-600 hover:bg-olive-700 text-white hover:shadow-xl hover:shadow-olive-600/30 hover:-translate-y-0.5'
                )}
              >
                {added ? <><Check size={16} /> ¡Agregado al carrito!</> : <><ShoppingBag size={16} /> Agregar al carrito</>}
              </button>

              <button
                onClick={() => toggle(product, token)}
                className={clsx(
                  'w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0',
                  isWishlisted ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-200 text-matte-black/40 hover:border-red-300 hover:text-red-400'
                )}
              >
                <Heart size={16} className={isWishlisted ? 'fill-red-500' : ''} />
              </button>
            </div>

            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border-2 border-[#25D366]/40 hover:border-[#25D366] text-[#25D366] font-medium text-sm transition-all duration-200 hover:bg-[#25D366]/5"
            >
              <MessageCircle size={16} />
              Consultar por WhatsApp
            </button>

            {/* Quick benefits */}
            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gray-100">
              {[
                { icon: Truck, label: 'Envío gratis', sub: 'A todo el país' },
                { icon: Shield, label: 'Pago seguro', sub: 'Mercado Pago' },
                { icon: RefreshCw, label: '30 días', sub: 'Para devolver' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex flex-col items-center text-center gap-1">
                  <div className="w-9 h-9 rounded-xl bg-olive-50 flex items-center justify-center">
                    <Icon size={15} className="text-olive-600" />
                  </div>
                  <span className="text-xs font-semibold text-matte-black">{label}</span>
                  <span className="text-[10px] text-matte-black/40">{sub}</span>
                </div>
              ))}
            </div>

            {/* Weight / dimensions */}
            <div className="flex items-center gap-4 text-xs text-matte-black/40 pt-1">
              <span>Peso: {product.weight}</span>
              <span>·</span>
              <span>Dimensiones: {product.dimensions}</span>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b border-gray-200 gap-6">
            {[
              { id: 'descripcion', label: 'Descripción' },
              { id: 'caracteristicas', label: 'Características' },
              { id: 'envio', label: 'Envío y devoluciones' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'pb-3 text-sm font-medium border-b-2 -mb-px transition-all duration-200',
                  activeTab === tab.id
                    ? 'border-olive-600 text-olive-600'
                    : 'border-transparent text-matte-black/40 hover:text-matte-black'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-8 max-w-2xl">
            {activeTab === 'descripcion' && (
              <p className="text-matte-black/60 leading-relaxed">{product.description}</p>
            )}
            {activeTab === 'caracteristicas' && (
              <ul className="flex flex-col gap-3">
                {product.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-matte-black/70">
                    <div className="w-5 h-5 rounded-full bg-olive-100 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-olive-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'envio' && (
              <div className="flex flex-col gap-4 text-matte-black/60 text-sm leading-relaxed">
                <p><strong className="text-matte-black">Envío gratis</strong> a todo el país en todos los pedidos. Tiempo estimado: 24-72 horas hábiles.</p>
                <p><strong className="text-matte-black">Devoluciones</strong>: Tenés 30 días desde la entrega para devolver el producto sin dar explicaciones.</p>
                <p><strong className="text-matte-black">Garantía</strong>: 12 meses de garantía en todos nuestros productos contra defectos de fabricación.</p>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-olive-600 text-xs font-bold uppercase tracking-[0.2em] mb-2 block">
                  También te puede gustar
                </span>
                <h2 className="font-serif text-3xl font-bold text-matte-black">
                  Productos <span className="italic text-olive-600">relacionados</span>
                </h2>
              </div>
              <Link to={`/shop?categoria=${product.category}`} className="text-sm text-matte-black/50 hover:text-olive-600 transition-colors duration-200 border-b border-current pb-0.5">
                Ver todos
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
