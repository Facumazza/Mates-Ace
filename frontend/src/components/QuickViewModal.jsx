import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag, Star, Check, ChevronRight } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { useWishlistStore } from '../store/useWishlistStore'
import { useAuthStore } from '../store/useAuthStore'
import { formatPrice } from '../data/products'
import clsx from 'clsx'

export default function QuickViewModal({ product, onClose }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const addItem = useCartStore((s) => s.addItem)
  const toggle = useWishlistStore((s) => s.toggle)
  const isWishlisted = useWishlistStore((s) => product && s.isWishlisted(product.id))
  const token = useAuthStore((s) => s.token)

  const handleAddToCart = () => {
    addItem(product, quantity, selectedVariant)
    setAdded(true)
    setTimeout(() => { setAdded(false); onClose() }, 1200)
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[60] bg-matte-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[860px] max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              <X size={16} />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Images */}
              <div className="relative bg-sand-50">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full aspect-square object-cover rounded-tl-3xl rounded-bl-none md:rounded-bl-3xl rounded-tr-3xl md:rounded-tr-none"
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/qv-${product.id}/600/600` }}
                />
                {product.images.length > 1 && (
                  <div className="flex gap-2 p-3 absolute bottom-0 left-0 right-0">
                    {product.images.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(i)}
                        className={clsx(
                          'w-12 h-12 rounded-xl overflow-hidden border-2 transition-all duration-200',
                          selectedImage === i ? 'border-olive-500' : 'border-transparent opacity-60 hover:opacity-100'
                        )}
                      >
                        <img src={img} alt="" className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = `https://picsum.photos/seed/qv-${product.id}-${i}/100/100` }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-7 flex flex-col gap-4">
                <div>
                  <span className="text-xs uppercase tracking-widest text-olive-600 font-semibold">{product.category}</span>
                  <h2 className="font-serif text-2xl font-bold text-matte-black mt-1 leading-tight">{product.name}</h2>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={13} className={i < Math.round(product.rating) ? 'fill-sand-400 text-sand-400' : 'fill-gray-200 text-gray-200'} />
                    ))}
                  </div>
                  <span className="text-sm text-matte-black/50">{product.rating} ({product.reviewCount} reseñas)</span>
                </div>

                {/* Price */}
                <div>
                  <div className="flex items-baseline gap-3">
                    <span className="font-bold text-3xl text-matte-black">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-matte-black/30 line-through text-lg">{formatPrice(product.originalPrice)}</span>
                    )}
                  </div>
                </div>

                <p className="text-matte-black/60 text-sm leading-relaxed line-clamp-3">{product.description}</p>

                {/* Features */}
                <div className="flex flex-col gap-1.5">
                  {product.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-matte-black/70">
                      <Check size={13} className="text-olive-600 flex-shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 1 && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-matte-black/40 mb-2">Variante</p>
                    <div className="flex flex-wrap gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.value}
                          onClick={() => v.available && setSelectedVariant(v)}
                          disabled={!v.available}
                          className={clsx(
                            'px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all duration-200',
                            !v.available && 'opacity-30 cursor-not-allowed',
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

                {/* Quantity */}
                <div className="flex items-center gap-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-matte-black/40">Cantidad</p>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center text-matte-black/40 hover:text-matte-black hover:bg-gray-50 transition-colors">−</button>
                    <span className="w-10 text-center text-sm font-medium">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-9 h-9 flex items-center justify-center text-matte-black/40 hover:text-matte-black hover:bg-gray-50 transition-colors">+</button>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAddToCart}
                    className={clsx(
                      'flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300',
                      added
                        ? 'bg-green-500 text-white'
                        : 'bg-olive-600 hover:bg-olive-700 text-white hover:shadow-lg hover:shadow-olive-600/30'
                    )}
                  >
                    {added ? <><Check size={16} /> ¡Agregado!</> : <><ShoppingBag size={16} /> Agregar al carrito</>}
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

                <Link
                  to={`/producto/${product.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-center gap-1 text-sm text-matte-black/40 hover:text-olive-600 transition-colors duration-200 mt-1"
                >
                  Ver detalle completo
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
