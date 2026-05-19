import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown, ChevronRight } from 'lucide-react'

const STATS = [
  { value: 'Envío gratis', label: 'A todo el país' },
  { value: '100%', label: 'Artesanal' },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Hero() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={ref} className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Parallax Background */}
      <motion.div className="absolute inset-0" style={{ y }}>
        <img
          src="/products/hero-bg.png"
          alt="Mate premium cinematográfico"
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Multi-layer gradient overlay */}
      <div className="absolute inset-0 bg-matte-black/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-matte-black/90 via-transparent to-matte-black/40" />

      {/* Decorative grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'1\'/%3E%3C/svg%3E")' }}
      />

      {/* Decorative circle - top right */}
      <div className="absolute top-32 right-20 w-64 h-64 rounded-full border border-olive-600/20 hidden lg:block" />
      <div className="absolute top-40 right-28 w-48 h-48 rounded-full border border-olive-600/10 hidden lg:block" />

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative z-10 flex-1 flex flex-col justify-center pt-28 pb-24"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              {/* Badge */}
              <motion.div variants={itemVariants}>
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-olive-500/40 bg-olive-600/10 text-olive-300 text-xs font-semibold tracking-[0.2em] uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-olive-400 animate-pulse" />
                  Artesanal · Premium · Argentino · Desde 2020
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                variants={itemVariants}
                className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white leading-[0.95] tracking-tight"
              >
                El ritual
                <br />
                <span className="italic text-olive-300">argentino</span>
                <br />
                convertido en
                <br />
                experiencia.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                variants={itemVariants}
                className="text-white/60 text-lg sm:text-xl font-light leading-relaxed max-w-xl"
              >
                Mates premium diseñados para quienes viven el mate todos los días.
                Artesanía, tradición y diseño contemporáneo en cada pieza.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-olive-600 hover:bg-olive-500 text-white font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-olive-600/40 hover:-translate-y-0.5 text-sm tracking-wide"
                >
                  Comprar ahora
                  <ChevronRight size={16} />
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 border border-white/30 hover:border-white text-white font-medium px-8 py-4 rounded-full transition-all duration-300 hover:bg-white/10 text-sm tracking-wide"
                >
                  Ver colección
                </Link>
              </motion.div>

            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="absolute bottom-16 left-0 right-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-8 sm:gap-16 items-center">
              {STATS.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="font-serif text-2xl font-bold text-white">{stat.value}</span>
                  <span className="text-white/40 text-xs uppercase tracking-widest mt-0.5">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 z-10"
      >
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  )
}
