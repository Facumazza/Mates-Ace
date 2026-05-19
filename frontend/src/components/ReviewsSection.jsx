import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MessageSquare, Send, User } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

function StarRating({ value, onChange, readonly = false }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={readonly ? 'button' : 'button'}
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={readonly ? 'cursor-default' : 'cursor-pointer transition-transform hover:scale-110'}
        >
          <Star
            size={readonly ? 14 : 22}
            className={`transition-colors ${
              star <= (hovered || value)
                ? 'fill-sand-400 text-sand-400'
                : 'fill-transparent text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  )
}

function ReviewCard({ review }) {
  const initials = review.userName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const date = new Date(review.createdAt).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-olive-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-semibold text-matte-black text-sm">{review.userName}</p>
            <p className="text-matte-black/40 text-xs">{date}</p>
          </div>
        </div>
        <StarRating value={review.rating} readonly />
      </div>
      <p className="text-matte-black/70 text-sm leading-relaxed">{review.comment}</p>
    </motion.div>
  )
}

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState({ count: 0, average: 0 })
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const currentUser = useAuthStore((s) => s.currentUser)
  const token = useAuthStore((s) => s.token)
  const openModal = useAuthStore((s) => s.openModal)

  const load = () => {
    fetch('/api/reviews')
      .then((r) => r.ok ? r.json() : [])
      .then((data) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => {})
    fetch('/api/reviews/summary')
      .then((r) => r.ok ? r.json() : { count: 0, average: 0 })
      .then((data) => setSummary(data || { count: 0, average: 0 }))
      .catch(() => {})
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (rating === 0) { setError('Seleccioná una calificación.'); return }
    if (!comment.trim()) { setError('Escribí un comentario.'); return }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rating, comment }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Error al enviar.')
      } else {
        setSuccess(true)
        setRating(0)
        setComment('')
        load()
      }
    } catch {
      setError('Error de conexión.')
    }
    setLoading(false)
  }

  return (
    <section className="py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold tracking-[0.3em] uppercase text-olive-600 mb-4">
            Comunidad
          </span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-matte-black mb-4">
            Lo que dice nuestra comunidad
          </h2>
          {summary.count > 0 && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <StarRating value={Math.round(summary.average)} readonly />
              <span className="font-bold text-matte-black text-lg">{summary.average}</span>
              <span className="text-matte-black/40 text-sm">({summary.count} {summary.count === 1 ? 'reseña' : 'reseñas'})</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-10">

          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 sticky top-28">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-full bg-olive-100 flex items-center justify-center">
                  <MessageSquare size={15} className="text-olive-600" />
                </div>
                <h3 className="font-serif text-lg font-bold text-matte-black">Dejá tu reseña</h3>
              </div>

              {!currentUser ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <User size={24} className="text-gray-400" />
                  </div>
                  <p className="text-matte-black/60 text-sm mb-4">Iniciá sesión para dejar tu reseña</p>
                  <button
                    onClick={() => openModal('login')}
                    className="w-full py-3 rounded-xl bg-olive-600 hover:bg-olive-700 text-white font-semibold text-sm transition-colors"
                  >
                    Iniciar sesión
                  </button>
                </div>
              ) : success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                >
                  <div className="w-14 h-14 rounded-full bg-olive-100 flex items-center justify-center mx-auto mb-3">
                    <Star size={24} className="text-olive-600 fill-olive-600" />
                  </div>
                  <p className="font-semibold text-matte-black">¡Gracias por tu reseña!</p>
                  <p className="text-matte-black/50 text-sm mt-1">Tu opinión ayuda a otros compradores.</p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-olive-600 text-sm font-semibold hover:underline"
                  >
                    Escribir otra
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-matte-black/50 mb-2 block">
                      Calificación
                    </label>
                    <StarRating value={rating} onChange={setRating} />
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-matte-black/50 mb-2 block">
                      Comentario
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Contanos tu experiencia con nuestros productos..."
                      rows={4}
                      maxLength={1000}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-matte-black placeholder-matte-black/30 focus:outline-none focus:ring-2 focus:ring-olive-400 focus:border-transparent resize-none transition-all"
                    />
                    <p className="text-xs text-matte-black/30 text-right mt-1">{comment.length}/1000</p>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-xl"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-olive-600 hover:bg-olive-700 text-white font-semibold text-sm transition-colors disabled:opacity-60"
                  >
                    {loading
                      ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      : <><Send size={14} /> Publicar reseña</>
                    }
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Reviews list */}
          <div className="lg:col-span-2">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-matte-black/30 gap-3">
                <MessageSquare size={40} strokeWidth={1.5} />
                <p className="text-sm">Todavía no hay reseñas. ¡Sé el primero!</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {reviews.map((r) => <ReviewCard key={r.id} review={r} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
