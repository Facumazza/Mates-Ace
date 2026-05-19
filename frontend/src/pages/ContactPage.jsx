import { useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Mail, MapPin, Phone, Send, CheckCircle, Clock, Instagram } from 'lucide-react'

const FAQS = [
  {
    q: '¿Cuánto tarda el envío?',
    a: 'Los envíos a todo el país tardan entre 24 y 72 horas hábiles. Para zonas alejadas puede ser hasta 5 días hábiles.',
  },
  {
    q: '¿Cómo se cura el mate por primera vez?',
    a: 'Cada mate viene con instrucciones. En general: llenalo con yerba húmeda, dejalo 24hs y repetí el proceso 3 veces antes del primer uso real.',
  },
  {
    q: '¿Puedo pedir grabado personalizado?',
    a: 'Sí. En los kits premium podés pedir grabado láser con nombre o mensaje. Escribinos por WhatsApp para coordinar.',
  },
  {
    q: '¿Qué métodos de pago aceptan?',
    a: 'Mercado Pago (tarjetas, débito, efectivo, cuotas sin interés), transferencia bancaria y pago en efectivo por correo.',
  },
  {
    q: '¿Tienen garantía los productos?',
    a: 'Todos nuestros productos tienen 12 meses de garantía contra defectos de fabricación.',
  },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '', subject: 'consulta' })
  const [sent, setSent] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const msg = encodeURIComponent(
      `Nombre: ${form.name}\nEmail: ${form.email}\nAsunto: ${form.subject}\n\n${form.message}`
    )
    window.open(`https://wa.me/5491112345678?text=${msg}`, '_blank')
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Header */}
      <div className="bg-matte-black pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-matte-black to-olive-950" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-olive-400 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
              Estamos acá para ayudarte
            </span>
            <h1 className="font-serif text-5xl font-bold text-white leading-tight">
              Contacto
            </h1>
            <p className="text-white/40 mt-3 text-sm max-w-md">
              Respondemos en menos de 2 horas de lunes a sábado.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-14">

          {/* Contact info + quick access */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8"
          >
            <div>
              <h2 className="font-serif text-3xl font-bold text-matte-black mb-6">
                Hablemos
              </h2>

              <div className="flex flex-col gap-5">
                <a
                  href="https://wa.me/5491112345678"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-5 rounded-2xl bg-white hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#25D366]/30"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#25D366]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
                    <MessageCircle size={20} className="text-[#25D366]" />
                  </div>
                  <div>
                    <p className="font-semibold text-matte-black">WhatsApp</p>
                    <p className="text-matte-black/50 text-sm">+54 9 11 1234-5678</p>
                    <p className="text-[#25D366] text-xs font-medium mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
                      Respuesta en minutos
                    </p>
                  </div>
                </a>

                <a
                  href="mailto:hola@matesace.com.ar"
                  className="group flex items-start gap-4 p-5 rounded-2xl bg-white hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-olive-200"
                >
                  <div className="w-12 h-12 rounded-2xl bg-olive-50 flex items-center justify-center flex-shrink-0 group-hover:bg-olive-100 transition-colors">
                    <Mail size={20} className="text-olive-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-matte-black">Email</p>
                    <p className="text-matte-black/50 text-sm">hola@matesace.com.ar</p>
                    <p className="text-olive-600 text-xs font-medium mt-1">Respondemos en el día</p>
                  </div>
                </a>

                <a
                  href="https://instagram.com/matesace"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-4 p-5 rounded-2xl bg-white hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-purple-200"
                >
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors">
                    <Instagram size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-matte-black">Instagram</p>
                    <p className="text-matte-black/50 text-sm">@matesace</p>
                    <p className="text-purple-600 text-xs font-medium mt-1">DMs abiertos</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100">
                  <div className="w-12 h-12 rounded-2xl bg-sand-50 flex items-center justify-center flex-shrink-0">
                    <Clock size={20} className="text-sand-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-matte-black">Horario de atención</p>
                    <p className="text-matte-black/50 text-sm">Lunes a Viernes: 9:00 – 18:00</p>
                    <p className="text-matte-black/50 text-sm">Sábados: 10:00 – 14:00</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {sent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full gap-5 text-center py-16"
              >
                <div className="w-20 h-20 rounded-full bg-olive-100 flex items-center justify-center">
                  <CheckCircle size={36} className="text-olive-600" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-matte-black">¡Mensaje enviado!</h3>
                <p className="text-matte-black/50 max-w-sm">
                  Te redirigimos a WhatsApp para una respuesta más rápida. ¡Gracias por contactarnos!
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="btn-outline"
                >
                  Enviar otro mensaje
                </button>
              </motion.div>
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h2 className="font-serif text-2xl font-bold text-matte-black mb-6">Envianos un mensaje</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-matte-black/50">Nombre</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Tu nombre"
                        className="input-field"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-matte-black/50">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="tu@email.com"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-matte-black/50">Asunto</label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="input-field bg-white"
                    >
                      <option value="consulta">Consulta sobre producto</option>
                      <option value="pedido">Estado de pedido</option>
                      <option value="personalizado">Mate personalizado / grabado</option>
                      <option value="devolucion">Cambio o devolución</option>
                      <option value="mayorista">Venta mayorista</option>
                      <option value="otro">Otro</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-matte-black/50">Mensaje</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="Contanos en qué podemos ayudarte..."
                      className="input-field resize-none"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full justify-center">
                    <Send size={16} />
                    Enviar por WhatsApp
                  </button>

                  <p className="text-xs text-matte-black/30 text-center">
                    Al enviar, abriremos WhatsApp con tu mensaje pre-cargado.
                  </p>
                </form>
              </div>
            )}
          </motion.div>
        </div>

        {/* FAQ */}
        <div className="mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-olive-600 text-xs font-semibold uppercase tracking-[0.25em] mb-3 block">
              Preguntas frecuentes
            </span>
            <h2 className="font-serif text-4xl font-bold text-matte-black">
              Todo lo que necesitás <span className="italic text-olive-600">saber</span>
            </h2>
          </motion.div>

          <div className="max-w-3xl mx-auto flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-matte-black">{faq.q}</span>
                  <span className={`text-olive-600 text-xl transition-transform duration-200 flex-shrink-0 ml-4 ${openFaq === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-6 pb-5 text-matte-black/60 text-sm leading-relaxed border-t border-gray-50"
                  >
                    <p className="pt-4">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
