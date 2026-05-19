import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

const MILESTONES = [
  { year: '2020', text: 'Fundamos Mates Ace en Córdoba con 3 artesanos y una misión: elevar el mate argentino.' },
  { year: '2022', text: 'Superamos los 5.000 clientes satisfechos. Expandimos a todo el país.' },
  { year: '2023', text: 'Lanzamos la línea Imperial Alpaca, nuestra colección más premium.' },
  { year: '2024', text: 'Más de 10.000 familias argentinas eligen Mates Ace cada día.' },
]

export default function Story() {
  return (
    <section className="py-24 bg-warm-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            {/* Main image */}
            <div className="relative rounded-3xl overflow-hidden aspect-[4/5] shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=800&q=80"
                alt="Artesano tallando un mate"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://picsum.photos/seed/story-artisan/800/1000' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-matte-black/40 to-transparent" />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl p-5 w-40"
            >
              <p className="font-serif text-4xl font-bold text-olive-600">100%</p>
              <p className="text-matte-black/60 text-xs leading-tight mt-1 uppercase tracking-wider">Hecho en Argentina</p>
            </motion.div>

            {/* Second smaller image */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="absolute top-6 -right-8 w-36 h-44 rounded-2xl overflow-hidden shadow-xl border-4 border-white hidden lg:block"
            >
              <img
                src="https://images.unsplash.com/photo-1621525271222-b5c9fbc4571e?w=400&q=80"
                alt="Detalle artesanal"
                className="w-full h-full object-cover"
                onError={(e) => { e.target.src = 'https://picsum.photos/seed/story-detail/400/500' }}
              />
            </motion.div>
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-col gap-8"
          >
            <div>
              <span className="text-olive-600 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
                Nuestra historia
              </span>
              <h2 className="font-serif text-4xl sm:text-5xl font-bold text-matte-black leading-tight">
                Tradición argentina
                <br />
                <span className="italic text-olive-600">con alma moderna</span>
              </h2>
            </div>

            <div className="flex flex-col gap-4 text-matte-black/60 leading-relaxed">
              <p>
                Mates Ace nació de una obsesión: la de tomar el mejor mate posible. Éramos tres amigos cordobeses que creíamos que el mate, uno de los rituales más profundos de la cultura argentina, merecía una experiencia a la altura.
              </p>
              <p>
                Empezamos tallando en un garaje, aprendiendo de los mejores artesanos del país, buscando las mejores maderas y los mejores procesos de curado. Hoy somos un equipo de 15 personas apasionadas, pero el espíritu artesanal no cambió en absoluto.
              </p>
              <p>
                Cada mate que sale de Mates Ace fue pensado, diseñado y fabricado para durar toda la vida y mejorar con el tiempo, como el buen mate que se ceba.
              </p>
            </div>

            {/* Milestones */}
            <div className="flex flex-col gap-4 border-l-2 border-olive-200 pl-6">
              {MILESTONES.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative"
                >
                  <div className="absolute -left-8 top-0.5 w-3 h-3 rounded-full bg-olive-500 border-2 border-warm-white" />
                  <span className="text-olive-600 text-xs font-bold tracking-widest">{m.year}</span>
                  <p className="text-matte-black/60 text-sm mt-0.5 leading-relaxed">{m.text}</p>
                </motion.div>
              ))}
            </div>

            <Link
              to="/nosotros"
              className="inline-flex items-center gap-2 text-matte-black font-medium hover:text-olive-600 transition-colors duration-200 group text-sm border-b border-current pb-0.5 self-start"
            >
              Conocer más sobre nosotros
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
