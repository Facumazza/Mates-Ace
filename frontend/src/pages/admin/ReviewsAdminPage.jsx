import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Eye, EyeOff, MessageSquare, Search, X } from 'lucide-react'
import { api } from '../../api/client'
import { useAuthStore } from '../../store/useAuthStore'
import clsx from 'clsx'

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={11}
          className={s <= rating ? 'fill-amber-400 text-amber-400' : 'text-white/15'}
        />
      ))}
    </div>
  )
}

export default function ReviewsAdminPage() {
  const token = useAuthStore((s) => s.token)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.get('/reviews/admin/all', token)
      .then(setReviews)
      .finally(() => setLoading(false))
  }, [token])

  const handleToggle = async (review) => {
    try {
      const updated = await api.patch(`/reviews/${review.id}/hidden`, {}, token)
      setReviews((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
    } catch (e) {
      console.error(e)
    }
  }

  const filtered = reviews.filter((r) => {
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'visible' ? !r.hidden :
      r.hidden
    const matchesQ = !query.trim() ||
      r.userName.toLowerCase().includes(query.toLowerCase()) ||
      r.comment.toLowerCase().includes(query.toLowerCase())
    return matchesFilter && matchesQ
  })

  const visibleCount = reviews.filter((r) => !r.hidden).length
  const hiddenCount  = reviews.filter((r) => r.hidden).length

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-bold text-white">Reseñas</h1>
        <p className="text-white/30 text-sm mt-1">
          {visibleCount} visibles · {hiddenCount} ocultas
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por usuario o comentario..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder-white/20 focus:outline-none focus:border-olive-500 transition-all duration-200"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors">
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1">
          {[
            { key: 'all',     label: 'Todas' },
            { key: 'visible', label: 'Visibles' },
            { key: 'hidden',  label: 'Ocultas' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                filter === t.key ? 'bg-olive-600 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="py-20 text-center text-white/30 text-sm">Cargando...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center">
          <MessageSquare size={32} className="text-white/10 mx-auto mb-3" />
          <p className="text-white/30 text-sm">No hay reseñas.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {filtered.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={clsx(
                  'bg-[#1A1A1A] border rounded-2xl p-5 flex items-start gap-4 transition-all duration-200',
                  review.hidden ? 'border-white/5 opacity-50' : 'border-white/5'
                )}
              >
                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-olive-600/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-olive-400 text-sm font-bold">
                    {review.userName?.[0]?.toUpperCase() ?? '?'}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-white text-sm font-semibold">{review.userName}</span>
                    <StarRating rating={review.rating} />
                    {review.productId && (
                      <span className="text-white/25 text-[10px] font-mono">#{review.productId}</span>
                    )}
                    <span className="text-white/20 text-[10px]">
                      {new Date(review.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {review.hidden && (
                      <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-[10px] font-semibold">
                        Oculta
                      </span>
                    )}
                  </div>
                  <p className="text-white/50 text-sm mt-2 leading-relaxed">{review.comment}</p>
                </div>

                {/* Toggle button */}
                <button
                  onClick={() => handleToggle(review)}
                  title={review.hidden ? 'Mostrar reseña' : 'Ocultar reseña'}
                  className={clsx(
                    'flex-shrink-0 p-2 rounded-lg transition-all duration-200',
                    review.hidden
                      ? 'bg-olive-600/20 text-olive-400 hover:bg-olive-600/30'
                      : 'bg-white/5 text-white/30 hover:bg-red-500/10 hover:text-red-400'
                  )}
                >
                  {review.hidden ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
