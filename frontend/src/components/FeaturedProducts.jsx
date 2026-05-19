import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useAllProducts } from '../hooks/useAllProducts'
import ProductCard from './ProductCard'
import QuickViewModal from './QuickViewModal'

const FILTERS = [
  { label: 'Todos', value: 'all' },
  { label: 'Mates', value: 'mates' },
  { label: 'Termos', value: 'termos' },
  { label: 'Bombillas', value: 'bombillas' },
  { label: 'Combos', value: 'combos' },
]

export default function FeaturedProducts() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const PRODUCTS = useAllProducts()

  const filtered = activeFilter === 'all'
    ? PRODUCTS.slice(0, 8)
    : PRODUCTS.filter((p) => p.category === activeFilter).slice(0, 8)

  return (
    <section className="py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-10"
        >
          <div>
            <span className="text-olive-600 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
              Lo más elegido
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-matte-black leading-tight">
              Productos
              <br />
              <span className="italic text-olive-600">destacados</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-matte-black hover:text-olive-600 transition-colors duration-200 text-sm font-medium border-b border-current pb-0.5 group"
          >
            Ver todos los productos
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === f.value
                  ? 'bg-olive-600 text-white shadow-lg shadow-olive-600/20'
                  : 'bg-white text-matte-black/60 hover:text-matte-black hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <ProductCard
                  product={product}
                  onQuickView={setQuickViewProduct}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center mt-14"
        >
          <Link
            to="/shop"
            className="btn-outline group"
          >
            Ver toda la tienda
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </section>
  )
}
