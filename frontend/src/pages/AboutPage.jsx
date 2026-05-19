import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Award, Users, Leaf, ArrowRight } from 'lucide-react'

const TEAM = [
  {
    name: 'Nicolás Romero',
    role: 'Co-fundador & Artesano principal',
    image: 'https://picsum.photos/seed/team1/400/400',
    bio: '15 años tallando madera. Aprendió con su abuelo en Córdoba.',
  },
  {
    name: 'Sofía Álvarez',
    role: 'Co-fundadora & Diseño',
    image: 'https://picsum.photos/seed/team2/400/400',
    bio: 'Diseñadora industrial. Fusiona estética moderna con tradición.',
  },
  {
    name: 'Matías Herrera',
    role: 'Co-fundador & Producción',
    image: 'https://picsum.photos/seed/team3/400/400',
    bio: 'Ingeniero de materiales. Garantiza calidad en cada pieza.',
  },
]

const VALUES = [
  {
    icon: Heart,
    title: 'Pasión',
    desc: 'Cada mate que hacemos es una declaración de amor por el ritual argentino.',
    color: 'text-red-500',
    bg: 'bg-red-50',
  },
  {
    icon: Award,
    title: 'Calidad',
    desc: 'Usamos solo las mejores maderas y materiales. Sin compromisos.',
    color: 'text-olive-600',
    bg: 'bg-olive-50',
  },
  {
    icon: Users,
    title: 'Comunidad',
    desc: 'Somos parte de una comunidad matera que crece cada día.',
    color: 'text-sand-600',
    bg: 'bg-sand-50',
  },
  {
    icon: Leaf,
    title: 'Sustentabilidad',
    desc: 'Maderas certificadas y procesos responsables con el ambiente.',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero */}
      <div className="relative bg-matte-black min-h-[60vh] flex items-end pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?w=1920&q=80"
            alt="Artesano Mates Ace"
            className="w-full h-full object-cover opacity-40"
            onError={(e) => { e.target.src = 'https://picsum.photos/seed/about-hero/1920/1080' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-matte-black via-matte-black/60 to-matte-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-olive-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
              Nuestra historia
            </span>
            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[0.95] tracking-tight">
              Tradición argentina
              <br />
              <span className="italic text-olive-300">con alma moderna</span>
            </h1>
          </motion.div>
        </div>
      </div>

      {/* Story */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none text-matte-black/70 leading-relaxed"
          >
            <p className="text-xl font-light leading-relaxed mb-6">
              Mates Ace nació de una obsesión compartida: la de tomar el mejor mate posible.
              Éramos tres amigos cordobeses convencidos de que el mate, uno de los rituales más
              profundos de la cultura argentina, merecía una experiencia a la altura.
            </p>
            <p className="mb-6">
              Empezamos en 2020, tallando en un garaje en Nueva Córdoba, aprendiendo de los mejores
              artesanos del país, buscando las maderas más nobles y perfeccionando los procesos de
              curado. Cada fracaso nos enseñó algo. Cada mate bien cebado nos confirmó que íbamos
              por el buen camino.
            </p>
            <p className="mb-6">
              Hoy somos un equipo de 15 personas apasionadas distribuidas entre Córdoba, Buenos Aires
              y Misiones —donde vive la madera de Palo Santo que da identidad a nuestra línea
              imperial. Pero el espíritu artesanal no cambió ni un poco.
            </p>
            <p>
              Cada mate que sale de Mates Ace fue pensado, diseñado y fabricado para durar toda
              la vida y mejorar con el tiempo, como el buen mate que se ceba.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-olive-600 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
              Lo que nos mueve
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-matte-black">
              Nuestros <span className="italic text-olive-600">valores</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4 p-8 rounded-3xl bg-warm-white"
              >
                <div className={`w-14 h-14 rounded-2xl ${v.bg} flex items-center justify-center`}>
                  <v.icon size={24} className={v.color} />
                </div>
                <h3 className="font-serif text-xl font-bold text-matte-black">{v.title}</h3>
                <p className="text-matte-black/50 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-14"
          >
            <span className="text-olive-600 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
              Detrás de cada mate
            </span>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold text-matte-black">
              El <span className="italic text-olive-600">equipo</span>
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {TEAM.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-4"
              >
                <div className="relative">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-xl"
                  />
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-olive-600 border-2 border-white" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-matte-black">{member.name}</h3>
                  <p className="text-olive-600 text-xs font-semibold uppercase tracking-wider mt-0.5">{member.role}</p>
                  <p className="text-matte-black/50 text-sm mt-2 leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-matte-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: '2020', label: 'Año de fundación' },
              { value: '+10k', label: 'Clientes felices' },
              { value: '15', label: 'Artesanos en el equipo' },
              { value: '100%', label: 'Hecho en Argentina' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <p className="font-serif text-5xl font-bold text-olive-300">{stat.value}</p>
                <p className="text-white/40 text-xs uppercase tracking-widest mt-2">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-warm-white">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-serif text-4xl font-bold text-matte-black mb-4">
              ¿Listo para vivir el
              <br />
              <span className="italic text-olive-600">ritual Mates Ace?</span>
            </h2>
            <p className="text-matte-black/50 mb-8">
              Explorá nuestra colección y encontrá el mate perfecto para cada momento.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/shop" className="btn-primary">
                Ver colección
                <ArrowRight size={16} />
              </Link>
              <Link to="/contacto" className="btn-outline">
                Contactarnos
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
