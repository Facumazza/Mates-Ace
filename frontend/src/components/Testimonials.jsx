import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { TESTIMONIALS } from '../data/testimonials'

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  const go = (next) => {
    setDirection(next > current ? 1 : -1)
    setCurrent(next)
  }

  const prev = () => go(current === 0 ? TESTIMONIALS.length - 1 : current - 1)
  const next = () => go(current === TESTIMONIALS.length - 1 ? 0 : current + 1)

  const t = TESTIMONIALS[current]

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-olive-50 opacity-60" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-sand-50 opacity-80" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-olive-600 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
            Testimonios
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-matte-black leading-tight">
            Lo que dicen
            <br />
            <span className="italic text-olive-600">nuestros clientes</span>
          </h2>
        </motion.div>

        {/* Testimonial card */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex flex-col items-center text-center gap-8"
            >
              {/* Quote icon */}
              <div className="w-14 h-14 rounded-full bg-olive-100 flex items-center justify-center">
                <Quote size={24} className="text-olive-600" />
              </div>

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={18} className="fill-sand-400 text-sand-400" />
                ))}
              </div>

              {/* Comment */}
              <blockquote className="font-serif text-2xl md:text-3xl text-matte-black font-medium leading-relaxed max-w-3xl italic">
                "{t.comment}"
              </blockquote>

              {/* Product */}
              <span className="px-4 py-1.5 rounded-full bg-olive-50 text-olive-700 text-xs font-semibold uppercase tracking-wider">
                {t.product}
              </span>

              {/* Author */}
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-olive-100"
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/av${t.id}/100/100` }}
                />
                <div className="text-left">
                  <p className="font-semibold text-matte-black text-sm">{t.name}</p>
                  <p className="text-matte-black/40 text-xs">{t.location} · {t.date}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-olive-400 hover:text-olive-600 transition-all duration-200"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => go(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? 'w-6 bg-olive-600' : 'w-1.5 bg-gray-200 hover:bg-olive-300'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-11 h-11 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-olive-400 hover:text-olive-600 transition-all duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Review summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center justify-center gap-8 mt-16 pt-12 border-t border-gray-100"
        >
          <div className="text-center">
            <p className="font-serif text-5xl font-bold text-matte-black">4.9</p>
            <div className="flex gap-0.5 justify-center mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={12} className="fill-sand-400 text-sand-400" />
              ))}
            </div>
            <p className="text-xs text-matte-black/40 mt-1 uppercase tracking-wider">Calificación promedio</p>
          </div>
          <div className="h-16 w-px bg-gray-200" />
          <div className="text-center">
            <p className="font-serif text-5xl font-bold text-matte-black">1.2k+</p>
            <p className="text-xs text-matte-black/40 mt-2 uppercase tracking-wider">Reseñas verificadas</p>
          </div>
          <div className="h-16 w-px bg-gray-200 hidden sm:block" />
          <div className="text-center hidden sm:block">
            <p className="font-serif text-5xl font-bold text-matte-black">98%</p>
            <p className="text-xs text-matte-black/40 mt-2 uppercase tracking-wider">Recomendarían</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
