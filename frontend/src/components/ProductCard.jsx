import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { useWishlistStore } from '../store/useWishlistStore'
import { useAuthStore } from '../store/useAuthStore'
import { formatPrice } from '../data/products'
import clsx from 'clsx'

const BADGE_MAP = {
  bestseller: { label: 'Más vendido', cls: 'bg-olive-600 text-white' },
  new:        { label: 'Nuevo',        cls: 'bg-sand-500 text-white' },
  sale:       { label: 'Oferta',       cls: 'bg-red-500 text-white' },
}

export default function ProductCard({ product, onQuickView }) {
  const [hovered, setHovered] = useState(false)
  const [added, setAdded] = useState(false)
  const addItem = useCartStore((s) => s.addItem)
  const toggle = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => s.isWishlisted(product.id))
  const token = useAuthStore((s) => s.token)
  const openModal = useAuthStore((s) => s.openModal)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!token) { openModal('login'); return }
    toggle(product, token)
  }

  const badge = product.badge ? BADGE_MAP[product.badge] : null
  const outOfStock = product.stock === 0
  const lowStock = product.stock != null && product.stock > 0 && product.stock <= 3

  return (
    <motion.article
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-400"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link to={`/producto/${product.slug}`} className="block">
        {/* Image container */}
        <div className="relative aspect-product bg-sand-50 overflow-hidden">
          {/* Primary image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={clsx(
              'w-full h-full object-cover transition-all duration-700',
              hovered && product.images[1] ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
            )}
            onError={(e) => { e.target.src = `https://picsum.photos/seed/prod-${product.id}/600/750` }}
          />

          {/* Hover / second image */}
          {product.images[1] && (
            <img
              src={product.images[1]}
              alt={`${product.name} - vista alternativa`}
              className={clsx(
                'absolute inset-0 w-full h-full object-cover transition-all duration-700',
                hovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
              )}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/prod-${product.id}-b/600/750` }}
            />
          )}

          {/* Badge */}
          {outOfStock ? (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gray-400 text-white">
              Sin stock
            </div>
          ) : lowStock ? (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500 text-white">
              Últimas {product.stock}
            </div>
          ) : badge ? (
            <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badge.cls}`}>
              {badge.label}
            </div>
          ) : null}


          {/* Action buttons - appear on hover */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-3 left-3 right-3 flex gap-2"
          >
            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={clsx(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300',
                outOfStock
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : added
                    ? 'bg-olive-600 text-white'
                    : 'bg-matte-black hover:bg-olive-600 text-white'
              )}
            >
              <ShoppingBag size={13} />
              {outOfStock ? 'Sin stock' : added ? '¡Agregado!' : 'Agregar'}
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onQuickView?.(product) }}
              className="p-2.5 rounded-xl bg-white/90 hover:bg-white text-matte-black transition-colors duration-200"
              aria-label="Vista rápida"
            >
              <Eye size={14} />
            </button>
          </motion.div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className={clsx(
              'absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300',
              '',
              isWishlisted
                ? 'bg-red-50 text-red-500'
                : 'bg-white/80 text-matte-black/40 hover:text-red-400'
            )}
            aria-label="Agregar a favoritos"
          >
            <Heart
              size={14}
              className={isWishlisted ? 'fill-red-500' : ''}
            />
          </button>
        </div>

        {/* Product info */}
        <div className="p-4 flex flex-col gap-2">
          {/* Category */}
          <span className="text-[10px] uppercase tracking-widest text-matte-black/40 font-medium">
            {product.category}
          </span>

          {/* Name */}
          <h3 className="font-medium text-matte-black text-sm leading-snug line-clamp-2 group-hover:text-olive-700 transition-colors duration-200">
            {product.name}
          </h3>

{/* Price */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-bold text-matte-black text-base">{formatPrice(product.price)}</span>
          </div>

        </div>
      </Link>
    </motion.article>
  )
}
