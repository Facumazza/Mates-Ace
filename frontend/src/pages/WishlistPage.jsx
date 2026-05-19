import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, X, ShoppingBag, ArrowRight } from 'lucide-react'
import { useWishlistStore } from '../store/useWishlistStore'
import { useCartStore } from '../store/useCartStore'
import { useAuthStore } from '../store/useAuthStore'
import { useAdminStore } from '../store/useAdminStore'
import { PRODUCTS, formatPrice } from '../data/products'

export default function WishlistPage() {
  const wishlistIds = useWishlistStore((s) => s.items)
  const remove = useWishlistStore((s) => s.remove)
  const clear = useWishlistStore((s) => s.clear)
  const addItem = useCartStore((s) => s.addItem)
  const token = useAuthStore((s) => s.token)
  const adminProducts = useAdminStore((s) => s.adminProducts)
  const allProducts = [...PRODUCTS, ...adminProducts]
  const items = wishlistIds.map((id) => allProducts.find((p) => String(p.id) === String(id))).filter(Boolean)

  const handleAddToCart = (product) => {
    addItem(product, 1)
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-matte-black pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-end justify-between"
          >
            <div>
              <span className="text-olive-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
                Mis guardados
              </span>
              <h1 className="font-serif text-4xl font-bold text-white flex items-center gap-3">
                Lista de deseos
                <Heart size={28} className="text-red-400 fill-red-400" />
              </h1>
            </div>
            {items.length > 0 && (
              <button
                onClick={clear}
                className="text-white/30 hover:text-white/60 text-sm transition-colors duration-200"
              >
                Limpiar todo
              </button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 gap-5 text-center"
          >
            <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center">
              <Heart size={40} className="text-red-200" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-matte-black">
              Tu wishlist está vacía
            </h2>
            <p className="text-matte-black/50 max-w-sm">
              Guardá los productos que te gustan para encontrarlos fácil más tarde.
            </p>
            <Link to="/shop" className="btn-primary mt-2">
              Explorar tienda
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <>
            <p className="text-matte-black/50 text-sm mb-8">
              <span className="font-semibold text-matte-black">{items.length}</span> producto{items.length !== 1 ? 's' : ''} guardado{items.length !== 1 ? 's' : ''}
            </p>

            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              <AnimatePresence mode="popLayout">
                {items.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                    className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    {/* Remove button */}
                    <button
                      onClick={() => remove(product.id, token)}
                      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-red-50 flex items-center justify-center text-matte-black/30 hover:text-red-500 transition-all duration-200 shadow-sm"
                      aria-label="Quitar de wishlist"
                    >
                      <X size={13} />
                    </button>

                    <Link to={`/producto/${product.slug}`}>
                      <div className="aspect-product bg-sand-50 overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => { e.target.src = `https://picsum.photos/seed/wl-${product.id}/600/750` }}
                        />
                      </div>

                      <div className="p-4 flex flex-col gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-matte-black/40">{product.category}</span>
                        <h3 className="font-medium text-sm text-matte-black leading-snug line-clamp-2 group-hover:text-olive-700 transition-colors">
                          {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="font-bold text-matte-black">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-matte-black/30 line-through">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                      </div>
                    </Link>

                    <div className="px-4 pb-4">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-olive-600 hover:bg-olive-700 text-white text-xs font-semibold transition-colors duration-200"
                      >
                        <ShoppingBag size={13} />
                        Agregar al carrito
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Bottom actions */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-200">
              <Link
                to="/shop"
                className="text-sm text-matte-black/50 hover:text-olive-600 transition-colors duration-200 flex items-center gap-2"
              >
                Seguir explorando
                <ArrowRight size={14} />
              </Link>
              <button
                onClick={() => items.forEach((p) => addItem(p, 1))}
                className="btn-primary text-sm py-3 px-6"
              >
                <ShoppingBag size={14} />
                Agregar todo al carrito
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
