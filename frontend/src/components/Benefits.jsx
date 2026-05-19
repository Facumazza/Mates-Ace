import { motion } from 'framer-motion'
import { Truck, Shield, Award, Headphones, Star, RefreshCw } from 'lucide-react'

const BENEFITS = [
  {
    icon: Truck,
    title: 'Envío gratis',
    desc: 'A todo el país sin mínimo de compra. Entrega en 24-72hs.',
    color: 'text-olive-600',
    bg: 'bg-olive-50',
  },
  {
    icon: Shield,
    title: 'Pagos seguros',
    desc: 'Mercado Pago, tarjetas y transferencia. 100% seguro.',
    color: 'text-sand-600',
    bg: 'bg-sand-50',
  },
  {
    icon: Award,
    title: 'Calidad artesanal',
    desc: 'Cada pieza tallada a mano por artesanos argentinos.',
    color: 'text-leather-600',
    bg: 'bg-leather-50',
  },
  {
    icon: Headphones,
    title: 'Atención personalizada',
    desc: 'Asesoramiento por WhatsApp. Respondemos en minutos.',
    color: 'text-olive-600',
    bg: 'bg-olive-50',
  },
  {
    icon: Star,
    title: 'Garantía premium',
    desc: '12 meses de garantía en todos los productos.',
    color: 'text-sand-600',
    bg: 'bg-sand-50',
  },
  {
    icon: RefreshCw,
    title: 'Cambios y devoluciones',
    desc: '30 días para cambiar o devolver sin preguntas.',
    color: 'text-leather-600',
    bg: 'bg-leather-50',
  },
]

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function Benefits() {
  return (
    <section className="py-24 bg-matte-black relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-olive-900/20 -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-sand-900/10 translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-olive-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
            Por qué elegirnos
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white leading-tight">
            La experiencia
            <br />
            <span className="italic text-olive-300">Mates Ace</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {BENEFITS.map((b, i) => (
            <motion.div
              key={i}
              variants={itemVariants}
              className="group flex gap-4 p-6 rounded-2xl border border-white/5 bg-white/3 hover:bg-white/5 hover:border-white/10 transition-all duration-300"
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-2xl ${b.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <b.icon size={20} className={b.color} />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1.5">{b.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-14"
        >
          <a
            href="https://wa.me/5491112345678"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#1fba57] text-white font-semibold transition-colors duration-200 text-sm shadow-lg shadow-green-500/20"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactarnos por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  )
}
