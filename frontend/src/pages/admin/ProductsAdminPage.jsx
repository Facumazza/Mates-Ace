import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusCircle, Search, Edit2, Trash2, X, Package, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAdminStore } from '../../store/useAdminStore'
import { useAuthStore } from '../../store/useAuthStore'
import { PRODUCTS, formatPrice } from '../../data/products'
import clsx from 'clsx'

const PAGE_SIZE = 15

const BADGE_MAP = {
  bestseller: 'bg-olive-600/20 text-olive-400',
  new:        'bg-sand-600/20 text-sand-400',
  sale:       'bg-red-500/20 text-red-400',
}

export default function ProductsAdminPage() {
  const adminProducts = useAdminStore((s) => s.adminProducts)
  const deleteAdminProduct = useAdminStore((s) => s.deleteAdminProduct)
  const hideBaseProduct = useAdminStore((s) => s.hideBaseProduct)
  const fetchAdminProducts = useAdminStore((s) => s.fetchAdminProducts)
  const token = useAuthStore((s) => s.token)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [tab, setTab] = useState('all')
  const [page, setPage] = useState(1)

  useEffect(() => { fetchAdminProducts(token) }, [token])
  useEffect(() => { setPage(1) }, [query, categoryFilter, tab])

  const baseProducts = PRODUCTS.map((p) => ({ ...p, _isAdminProduct: false }))
  const allProducts = [...baseProducts, ...adminProducts]

  const filtered = allProducts.filter((p) => {
    const matchesTab = tab === 'admin' ? p._isAdminProduct : true
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter
    const matchesQ = !query.trim() || p.name.toLowerCase().includes(query.toLowerCase())
    return matchesTab && matchesCat && matchesQ
  })

  const handleDelete = async (product) => {
    if (product._isAdminProduct) {
      await deleteAdminProduct(product.id, token)
    } else {
      hideBaseProduct(product.id)
    }
    setConfirmDelete(null)
  }

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pagedFiltered = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const categories = ['all', ...new Set(allProducts.map((p) => p.category))]

  return (
    <div className="flex flex-col gap-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Productos</h1>
          <p className="text-white/30 text-sm mt-1">{allProducts.length} productos en total</p>
        </div>
        <Link
          to="/admin/productos/nuevo"
          className="flex items-center gap-2 bg-olive-600 hover:bg-olive-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-olive-600/20"
        >
          <PlusCircle size={16} />
          Nuevo producto
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar producto..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-olive-500 transition-all duration-200"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-olive-500 transition-all duration-200 capitalize"
        >
          {categories.map((c) => (
            <option key={c} value={c} className="bg-[#1A1A1A] capitalize">
              {c === 'all' ? 'Todas las categorías' : c.charAt(0).toUpperCase() + c.slice(1)}
            </option>
          ))}
        </select>

        {/* Tab: todos / solo admin */}
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
          {[
            { key: 'all',   label: 'Todos' },
            { key: 'admin', label: 'Agregados por mí' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                tab === t.key ? 'bg-olive-600 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {['Producto', 'Categoría', 'Precio', 'Badge', 'Estado', ''].map((h) => (
                  <th key={h} className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-16 text-center">
                      <Package size={32} className="text-white/10 mx-auto mb-3" />
                      <p className="text-white/30 text-sm">No se encontraron productos.</p>
                    </td>
                  </tr>
                ) : (
                  pagedFiltered.map((product, i) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2, delay: i * 0.02 }}
                      className="border-b border-white/5 last:border-0 hover:bg-white/2 transition-colors duration-150 group"
                    >
                      {/* Product */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => { e.target.src = `https://picsum.photos/seed/adm-${product.id}/100/100` }}
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-white text-sm font-medium truncate max-w-[200px]">{product.name}</p>
                            {product._isAdminProduct && (
                              <span className="text-olive-400 text-[10px] font-semibold">Agregado por admin</span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span className="text-white/40 text-xs capitalize">{product.category}</span>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-3.5">
                        <div className="flex flex-col">
                          <span className="text-white text-sm font-semibold">{formatPrice(product.price)}</span>
                          {product.originalPrice && (
                            <span className="text-white/25 text-xs line-through">{formatPrice(product.originalPrice)}</span>
                          )}
                        </div>
                      </td>

                      {/* Badge */}
                      <td className="px-5 py-3.5">
                        {product.badge ? (
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${BADGE_MAP[product.badge] || 'bg-white/10 text-white/50'}`}>
                            {product.badge}
                          </span>
                        ) : (
                          <span className="text-white/15 text-xs">—</span>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-3.5">
                        <span className={clsx(
                          'inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold',
                          product.inStock ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        )}>
                          {product.inStock ? 'En stock' : 'Sin stock'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <Link
                            to={`/admin/productos/editar/${product.id}`}
                            className="p-2 rounded-lg bg-white/5 hover:bg-olive-600/20 hover:text-olive-400 text-white/40 transition-all duration-200"
                            title="Editar"
                          >
                            <Edit2 size={13} />
                          </Link>
                          <button
                            onClick={() => setConfirmDelete(product)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/40 transition-all duration-200"
                            title="Eliminar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between gap-4">
            <span className="text-white/30 text-xs">
              Página {page} de {totalPages} · {filtered.length} productos
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce((acc, n, idx, arr) => {
                  if (idx > 0 && n - arr[idx - 1] > 1) acc.push('…')
                  acc.push(n)
                  return acc
                }, [])
                .map((n, i) =>
                  n === '…' ? (
                    <span key={`ellipsis-${i}`} className="w-8 text-center text-white/20 text-xs">…</span>
                  ) : (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-8 h-8 rounded-lg text-xs font-medium transition-all duration-150 ${
                        page === n
                          ? 'bg-olive-600 text-white'
                          : 'text-white/40 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {n}
                    </button>
                  )
                )}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-150"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirm modal */}
      <AnimatePresence>
        {confirmDelete && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setConfirmDelete(null)}
              className="fixed inset-0 z-50 bg-black/70"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed z-50 inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto bg-[#1E1E1E] border border-white/10 rounded-2xl p-7 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">Eliminar producto</h3>
                  <p className="text-white/40 text-sm mt-2">
                    ¿Estás seguro que querés eliminar <strong className="text-white">{confirmDelete.name}</strong>? Esta acción no se puede deshacer.
                  </p>
                </div>
                <div className="flex gap-3 w-full pt-2">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="flex-1 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white text-sm font-medium transition-all duration-200"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDelete(confirmDelete)}
                    className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-all duration-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
