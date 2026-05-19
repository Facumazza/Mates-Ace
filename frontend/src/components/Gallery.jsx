import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'

const IG_URL = 'https://www.instagram.com/mates.ace/'

const POSTS = [
  { src: '/products/mate-imperial.webp',        span: 'col-span-1 row-span-2' },
  { src: '/products/mate-torpedo.webp',          span: 'col-span-1' },
  { src: '/products/mate-camionero.jpg',         span: 'col-span-1' },
  { src: '/products/mate-imperial-negro.webp',   span: 'col-span-2' },
  { src: '/products/mate-torpedo-alpaca.webp',   span: 'col-span-1' },
  { src: '/products/mate-camionero-marron.jpg',  span: 'col-span-1' },
]

export default function Gallery() {
  return (
    <section className="py-24 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="text-olive-600 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
              @mates.ace
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-matte-black leading-tight">
              Seguinos en
              <br />
              <span className="italic text-olive-600">Instagram</span>
            </h2>
          </div>
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-matte-black/50 hover:text-matte-black transition-colors duration-200 text-sm font-medium"
          >
            <Instagram size={18} />
            Ver perfil
          </a>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[240px]"
        >
          {POSTS.map((post, i) => (
            <motion.a
              key={i}
              href={IG_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative overflow-hidden rounded-2xl bg-sand-100 ${post.span}`}
            >
              <img
                src={post.src}
                alt={`Mates Ace Instagram ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-matte-black/0 group-hover:bg-matte-black/50 transition-all duration-300 flex items-center justify-center">
                <Instagram size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <a
            href={IG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg"
          >
            <Instagram size={16} />
            Seguir @mates.ace
          </a>
        </motion.div>
      </div>
    </section>
  )
}
