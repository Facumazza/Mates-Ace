import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { CATEGORIES } from '../data/products'

const CATEGORY_IMAGES = {
  mates:       'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  termos:      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
  bombillas:   'https://images.unsplash.com/photo-1609766857491-57a5ebad3c4e?w=600&q=80',
  combos:      'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&q=80',
  accesorios:  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80',
}

const FALLBACK_SEEDS = {
  mates: 'cat-mates-wood',
  termos: 'cat-termos-steel',
  bombillas: 'cat-bombillas-silver',
  combos: 'cat-combos-gift',
  accesorios: 'cat-accesorios-craft',
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Categories() {
  return (
    <section className="py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-14"
        >
          <div>
            <span className="text-olive-600 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
              Explorar por categoría
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-matte-black leading-tight">
              Nuestra
              <br />
              <span className="italic text-olive-600">colección</span>
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-matte-black/50 hover:text-olive-600 transition-colors duration-200 text-sm font-medium group"
          >
            Ver todo
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {/* First large card */}
          {CATEGORIES.slice(0, 1).map((cat) => (
            <motion.div key={cat.id} variants={cardVariants} className="col-span-2 md:col-span-1 lg:col-span-2">
              <CategoryCard cat={cat} tall />
            </motion.div>
          ))}

          {/* Middle cards */}
          {CATEGORIES.slice(1, 4).map((cat) => (
            <motion.div key={cat.id} variants={cardVariants}>
              <CategoryCard cat={cat} />
            </motion.div>
          ))}

          {/* Last card */}
          {CATEGORIES.slice(4).map((cat) => (
            <motion.div key={cat.id} variants={cardVariants}>
              <CategoryCard cat={cat} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function CategoryCard({ cat, tall }) {
  return (
    <Link
      to={`/shop?categoria=${cat.slug}`}
      className={`group relative overflow-hidden rounded-3xl bg-matte-black block ${tall ? 'aspect-[4/5]' : 'aspect-[3/4]'}`}
    >
      <img
        src={CATEGORY_IMAGES[cat.id] || `https://picsum.photos/seed/${FALLBACK_SEEDS[cat.id]}/600/700`}
        alt={cat.label}
        className="w-full h-full object-cover opacity-80 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700"
        onError={(e) => {
          e.target.src = `https://picsum.photos/seed/${FALLBACK_SEEDS[cat.id] || cat.id}/600/700`
        }}
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 via-matte-black/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-6">
        {/* Count badge */}
        <div className="flex justify-end">
          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/70 text-xs">
            {cat.count} productos
          </span>
        </div>

        {/* Label + CTA */}
        <div className="flex flex-col gap-2">
          <span className="text-white/50 text-xs uppercase tracking-widest">{cat.description}</span>
          <h3 className="font-serif text-2xl font-bold text-white">{cat.label}</h3>

          <div className="flex items-center gap-2 text-olive-300 text-sm font-medium mt-1 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            Explorar
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  )
}
