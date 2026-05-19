import { Link } from 'react-router-dom'
import { Instagram, MessageCircle, Mail, MapPin, Phone, Heart } from 'lucide-react'

const LINKS_TIENDA = [
  { label: 'Inicio', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Mates', href: '/shop?categoria=mates' },
  { label: 'Termos', href: '/shop?categoria=termos' },
  { label: 'Bombillas', href: '/shop?categoria=bombillas' },
  { label: 'Combos', href: '/shop?categoria=combos' },
]

const LINKS_INFO = [
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
  { label: 'Políticas de envío', href: '/contacto' },
  { label: 'Devoluciones', href: '/contacto' },
  { label: 'Preguntas frecuentes', href: '/contacto' },
]

const PAYMENT_METHODS = [
  { label: 'Mercado Pago', icon: '💳' },
  { label: 'Visa', icon: '💳' },
  { label: 'Mastercard', icon: '💳' },
  { label: 'Transferencia', icon: '🏦' },
]

export default function Footer() {
  return (
    <footer className="bg-matte-black text-white">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-16">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-5 group">
              <img
                src="/products/logo.webp"
                alt="ACÉ"
                className="h-16 w-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-lg"
              />
            </Link>

            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Mates artesanales premium. Hechos en Argentina con tradición y pasión desde 2020.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com/matesace"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-olive-600 border border-white/10 hover:border-olive-500 flex items-center justify-center transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://wa.me/5491112345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-[#25D366] border border-white/10 hover:border-[#25D366] flex items-center justify-center transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="mailto:hola@matesace.com.ar"
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-olive-600 border border-white/10 hover:border-olive-500 flex items-center justify-center transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Tienda */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Tienda</h4>
            <ul className="flex flex-col gap-3">
              {LINKS_TIENDA.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Información */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Información</h4>
            <ul className="flex flex-col gap-3">
              {LINKS_INFO.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="text-white/40 hover:text-white text-sm transition-colors duration-200"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-5">Contacto</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-olive-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/40 text-sm">Córdoba, Argentina</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-olive-400 flex-shrink-0 mt-0.5" />
                <a
                  href="https://wa.me/5491112345678"
                  className="text-white/40 hover:text-white text-sm transition-colors duration-200"
                >
                  +54 9 11 1234-5678
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-olive-400 flex-shrink-0 mt-0.5" />
                <a
                  href="mailto:hola@matesace.com.ar"
                  className="text-white/40 hover:text-white text-sm transition-colors duration-200"
                >
                  hola@matesace.com.ar
                </a>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/5491112345678?text=Hola! Tengo una consulta sobre Mates Ace"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/20 text-[#25D366] text-sm font-medium transition-all duration-200"
            >
              <MessageCircle size={14} />
              Escribinos
            </a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/25 text-xs text-center sm:text-left">
              © {new Date().getFullYear()} Mates Ace. Todos los derechos reservados.
            </p>

            {/* Payment methods */}
            <div className="flex items-center gap-2">
              <span className="text-white/20 text-xs mr-1">Pagás con</span>
              {['Mercado Pago', 'Visa', 'Mastercard', 'Transferencia'].map((m) => (
                <span
                  key={m}
                  className="px-2.5 py-1 rounded-md bg-white/5 text-white/30 text-[10px] font-medium border border-white/5"
                >
                  {m}
                </span>
              ))}
            </div>

            <p className="text-white/20 text-xs flex items-center gap-1">
              Hecho con <Heart size={10} className="text-olive-600 fill-olive-600" /> en Argentina
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
