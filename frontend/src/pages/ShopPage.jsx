import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import { CATEGORIES } from '../data/products'
import { useAllProducts } from '../hooks/useAllProducts'
import ProductCard from '../components/ProductCard'
import QuickViewModal from '../components/QuickViewModal'

const SORT_OPTIONS = [
  { label: 'Destacados', value: 'featured' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
  { label: 'Más vendidos', value: 'bestseller' },
  { label: 'Novedades', value: 'new' },
]

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const categoryParam = searchParams.get('categoria') || 'all'
  const queryParam = searchParams.get('q') || ''
  const [sortBy, setSortBy] = useState('featured')
  const [localQuery, setLocalQuery] = useState(queryParam)
  const [priceMin, setPriceMin] = useState('')
  const [priceMax, setPriceMax] = useState('')
  const [showSale, setShowSale] = useState(false)
  const [showNew, setShowNew] = useState(false)

  useEffect(() => {
    setLocalQuery(queryParam)
  }, [queryParam])

  const PRODUCTS = useAllProducts()
  const activeCategory = categoryParam

  const setCategory = (cat) => {
    setSearchParams((prev) => {
      if (cat === 'all') {
        prev.delete('categoria')
      } else {
        prev.set('categoria', cat)
      }
      return prev
    })
  }

  const filtered = useMemo(() => {
    let result = [...PRODUCTS]

    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory)
    }

    if (localQuery.trim()) {
      const q = localQuery.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    if (priceMin) result = result.filter((p) => p.price >= Number(priceMin))
    if (priceMax) result = result.filter((p) => p.price <= Number(priceMax))
    if (showSale) result = result.filter((p) => p.isOnSale)
    if (showNew) result = result.filter((p) => p.isNew)

    switch (sortBy) {
      case 'price-asc':   result.sort((a, b) => a.price - b.price); break
      case 'price-desc':  result.sort((a, b) => b.price - a.price); break
      case 'bestseller':  result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0)); break
      case 'new':         result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break
      case 'rating':      result.sort((a, b) => b.rating - a.rating); break
      default: break
    }

    return result
  }, [activeCategory, localQuery, sortBy, priceMin, priceMax, showSale, showNew])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setSearchParams((prev) => {
      if (localQuery.trim()) {
        prev.set('q', localQuery.trim())
      } else {
        prev.delete('q')
      }
      return prev
    })
  }

  const clearFilters = () => {
    setLocalQuery('')
    setPriceMin('')
    setPriceMax('')
    setShowSale(false)
    setShowNew(false)
    setSortBy('featured')
    setSearchParams({})
  }

  const activeFilterCount = [
    activeCategory !== 'all',
    localQuery.trim(),
    priceMin,
    priceMax,
    showSale,
    showNew,
  ].filter(Boolean).length

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Page Header */}
      <div className="bg-matte-black pt-28 pb-14 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-matte-black via-matte-black to-olive-950" />
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-olive-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
              Tienda
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
              Toda la
              <br />
              <span className="italic text-olive-300">colección</span>
            </h1>
            <p className="text-white/40 text-sm mt-3 max-w-md leading-relaxed">
              {PRODUCTS.length} productos artesanales. Encontrá el mate perfecto para cada momento.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + Controls bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-matte-black/30" />
              <input
                type="text"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Buscar mates, termos, bombillas..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-transparent transition-all duration-200"
              />
              {localQuery && (
                <button type="button" onClick={() => setLocalQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-matte-black/30 hover:text-matte-black transition-colors">
                  <X size={14} />
                </button>
              )}
            </div>
          </form>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-matte-black/70 hover:text-matte-black transition-colors duration-200 min-w-[180px] justify-between"
            >
              <span>{SORT_OPTIONS.find((s) => s.value === sortBy)?.label}</span>
              <ChevronDown size={14} className={`transition-transform duration-200 ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                      className={`w-full text-left px-5 py-3 text-sm transition-colors duration-150 ${
                        sortBy === opt.value
                          ? 'bg-olive-50 text-olive-700 font-semibold'
                          : 'text-matte-black/60 hover:bg-gray-50 hover:text-matte-black'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Filters toggle (mobile) */}
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium text-matte-black/70 hover:text-matte-black transition-colors duration-200 sm:hidden"
          >
            <SlidersHorizontal size={14} />
            Filtros
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-olive-600 text-white text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters (desktop always visible, mobile collapsible) */}
          <aside className="hidden sm:block w-56 flex-shrink-0">
                <div className="sticky top-24 flex flex-col gap-6">
                  {/* Categories */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-matte-black mb-3">Categorías</h3>
                    <ul className="flex flex-col gap-1">
                      <li>
                        <button
                          onClick={() => setCategory('all')}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                            activeCategory === 'all'
                              ? 'bg-matte-black text-white font-semibold'
                              : 'text-matte-black/60 hover:text-matte-black hover:bg-gray-100'
                          }`}
                        >
                          Todos ({PRODUCTS.length})
                        </button>
                      </li>
                      {CATEGORIES.map((cat) => (
                        <li key={cat.id}>
                          <button
                            onClick={() => setCategory(cat.slug)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              activeCategory === cat.slug
                                ? 'bg-matte-black text-white font-semibold'
                                : 'text-matte-black/60 hover:text-matte-black hover:bg-gray-100'
                            }`}
                          >
                            {cat.label} ({PRODUCTS.filter((p) => p.category === cat.slug).length})
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Price range */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-matte-black mb-3">Precio (ARS)</h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Mín"
                        value={priceMin}
                        onChange={(e) => setPriceMin(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-transparent"
                      />
                      <span className="text-matte-black/30 text-sm">–</span>
                      <input
                        type="number"
                        placeholder="Máx"
                        value={priceMax}
                        onChange={(e) => setPriceMax(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Special */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-matte-black mb-3">Filtrar por</h3>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={showSale}
                          onChange={(e) => setShowSale(e.target.checked)}
                          className="w-4 h-4 rounded accent-olive-600"
                        />
                        <span className="text-sm text-matte-black/60 group-hover:text-matte-black transition-colors">En oferta</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={showNew}
                          onChange={(e) => setShowNew(e.target.checked)}
                          className="w-4 h-4 rounded accent-olive-600"
                        />
                        <span className="text-sm text-matte-black/60 group-hover:text-matte-black transition-colors">Novedades</span>
                      </label>
                    </div>
                  </div>

                  {/* Clear filters */}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-matte-black/40 hover:text-red-500 transition-colors duration-200 text-left"
                    >
                      Limpiar filtros ({activeFilterCount})
                    </button>
                  )}
                </div>
              </aside>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {/* Results count */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-matte-black/50">
                <span className="font-semibold text-matte-black">{filtered.length}</span> productos
                {activeCategory !== 'all' && (
                  <> en <span className="text-olive-600 font-medium capitalize">{activeCategory}</span></>
                )}
                {localQuery && <> para "<span className="text-olive-600 font-medium">{localQuery}</span>"</>}
              </p>
            </div>

            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 gap-4"
              >
                <div className="text-6xl">🧉</div>
                <h3 className="font-serif text-2xl font-bold text-matte-black">Sin resultados</h3>
                <p className="text-matte-black/50 text-sm text-center max-w-sm">
                  No encontramos productos con esos filtros. Probá ajustar tu búsqueda.
                </p>
                <button onClick={clearFilters} className="btn-primary mt-2">
                  Ver todos los productos
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
              >
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: i * 0.03 }}
                    >
                      <ProductCard product={product} onQuickView={setQuickViewProduct} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Quick View */}
      <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />

      {/* Mobile filters overlay */}
      <AnimatePresence>
        {filtersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFiltersOpen(false)}
              className="fixed inset-0 z-40 bg-matte-black/50 sm:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl overflow-y-auto sm:hidden"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-gray-100">
                <h2 className="font-serif text-xl font-bold">Filtros</h2>
                <button onClick={() => setFiltersOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="p-5 flex flex-col gap-6">
                {/* same content as desktop sidebar */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-matte-black mb-3">Categorías</h3>
                  <ul className="flex flex-col gap-1">
                    <li>
                      <button onClick={() => { setCategory('all'); setFiltersOpen(false) }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeCategory === 'all' ? 'bg-matte-black text-white font-semibold' : 'text-matte-black/60 hover:bg-gray-100'}`}>
                        Todos ({PRODUCTS.length})
                      </button>
                    </li>
                    {CATEGORIES.map((cat) => (
                      <li key={cat.id}>
                        <button onClick={() => { setCategory(cat.slug); setFiltersOpen(false) }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${activeCategory === cat.slug ? 'bg-matte-black text-white font-semibold' : 'text-matte-black/60 hover:bg-gray-100'}`}>
                          {cat.label} ({PRODUCTS.filter((p) => p.category === cat.slug).length})
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-matte-black mb-3">Precio</h3>
                  <div className="flex items-center gap-2">
                    <input type="number" placeholder="Mín" value={priceMin} onChange={(e) => setPriceMin(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-olive-400" />
                    <span className="text-matte-black/30">–</span>
                    <input type="number" placeholder="Máx" value={priceMax} onChange={(e) => setPriceMax(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-olive-400" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={showSale} onChange={(e) => setShowSale(e.target.checked)} className="w-4 h-4 accent-olive-600" />
                    <span className="text-sm text-matte-black/60">En oferta</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={showNew} onChange={(e) => setShowNew(e.target.checked)} className="w-4 h-4 accent-olive-600" />
                    <span className="text-sm text-matte-black/60">Novedades</span>
                  </label>
                </div>
                <button onClick={() => { clearFilters(); setFiltersOpen(false) }} className="btn-primary text-center justify-center">
                  Ver productos ({filtered.length})
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
