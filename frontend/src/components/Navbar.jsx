import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Search, Heart, Menu, X, ChevronDown, User, LogOut } from 'lucide-react'
import { useCartStore } from '../store/useCartStore'
import { useWishlistStore } from '../store/useWishlistStore'
import { useAuthStore } from '../store/useAuthStore'
import { useScrolled } from '../hooks/useScrolled'
import clsx from 'clsx'

const NAV_LINKS = [
  { label: 'Inicio', href: '/' },
  { label: 'Shop', href: '/shop' },
  {
    label: 'Productos',
    href: '/shop',
    children: [
      { label: 'Mates', href: '/shop?categoria=mates' },
      { label: 'Termos', href: '/shop?categoria=termos' },
      { label: 'Bombillas', href: '/shop?categoria=bombillas' },
      { label: 'Combos', href: '/shop?categoria=combos' },
      { label: 'Accesorios', href: '/shop?categoria=accesorios' },
    ],
  },
  { label: 'Nosotros', href: '/nosotros' },
  { label: 'Contacto', href: '/contacto' },
]

export default function Navbar() {
  const scrolled = useScrolled(60)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const items = useCartStore((s) => s.items)
  const openCart = useCartStore((s) => s.openCart)
  const wishlistItems = useWishlistStore((s) => s.items)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const currentUser = useAuthStore((s) => s.currentUser)
  const openModal = useAuthStore((s) => s.openModal)
  const logout = useAuthStore((s) => s.logout)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef(null)

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false) }, [location])

  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen || searchOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen, searchOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchOpen(false)
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <>
      <motion.header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-matte-black/96 backdrop-blur-xl shadow-2xl py-3'
            : 'bg-transparent py-5'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <img
                src="/products/logo.webp"
                alt="ACÉ"
                className="h-12 w-auto group-hover:scale-105 transition-transform duration-300 drop-shadow-md"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-7">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative group">
                    <button className="flex items-center gap-1 text-xs font-medium tracking-widest uppercase text-white/70 hover:text-white transition-colors duration-200">
                      {link.label}
                      <ChevronDown size={12} className="group-hover:rotate-180 transition-transform duration-300" />
                    </button>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-44 bg-matte-black/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.href}
                          className="block px-5 py-2.5 text-xs text-white/60 hover:text-white hover:bg-olive-600/20 transition-all duration-150"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={clsx(
                      'text-xs font-medium tracking-widest uppercase transition-colors duration-200',
                      location.pathname === link.href
                        ? 'text-olive-400'
                        : 'text-white/70 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white/70 hover:text-white transition-colors duration-200 hidden sm:block"
                aria-label="Buscar"
              >
                <Search size={19} />
              </button>

              <Link
                to="/wishlist"
                className="relative text-white/70 hover:text-white transition-colors duration-200 hidden sm:block"
                aria-label="Lista de deseos"
              >
                <Heart size={19} />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-sand-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>

              <button
                onClick={openCart}
                className="relative text-white/70 hover:text-white transition-colors duration-200"
                aria-label="Carrito"
              >
                <ShoppingBag size={19} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -top-2 -right-2 bg-olive-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              {/* User */}
              {currentUser ? (
                <div ref={userMenuRef} className="relative hidden sm:block">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="w-8 h-8 rounded-full bg-olive-600 flex items-center justify-center text-white text-xs font-bold hover:bg-olive-500 transition-colors duration-200"
                    aria-label="Mi cuenta"
                  >
                    {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-matte-black/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-white text-sm font-semibold truncate">{currentUser.name}</p>
                          <p className="text-white/40 text-xs truncate">{currentUser.email}</p>
                        </div>
                        <Link
                          to="/perfil"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 transition-colors duration-150 text-sm"
                        >
                          <User size={14} /> Mi perfil
                        </Link>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false) }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-white/70 hover:text-red-400 hover:bg-red-500/5 transition-colors duration-150 text-sm"
                        >
                          <LogOut size={14} /> Cerrar sesión
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button
                  onClick={() => openModal('login')}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/70 hover:text-white hover:border-olive-400 transition-all duration-200 text-xs font-semibold tracking-wide"
                >
                  <User size={14} /> Ingresar
                </button>
              )}

              <Link
                to="/shop"
                className="hidden lg:flex items-center bg-olive-600 hover:bg-olive-500 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all duration-200 hover:shadow-lg hover:shadow-olive-600/30 tracking-wide"
              >
                Comprar ahora
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden text-white p-1"
                aria-label="Menú"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Full-screen Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-matte-black flex flex-col"
          >
            {/* Header in mobile menu */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
              <Link to="/" onClick={() => setMobileOpen(false)}>
                <img src="/products/logo.webp" alt="ACÉ" className="h-10 w-auto" />
              </Link>
              <button onClick={() => setMobileOpen(false)} className="text-white/70">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-center px-8 gap-2">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 + 0.1 }}
                >
                  <Link
                    to={link.href}
                    className="block font-serif text-4xl font-bold text-white hover:text-olive-400 transition-colors duration-200 py-2 border-b border-white/5"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="px-8 pb-12 flex flex-col gap-4"
            >
              <Link
                to="/shop"
                className="btn-primary text-center justify-center py-4 text-base"
                onClick={() => setMobileOpen(false)}
              >
                Comprar ahora
              </Link>
              {currentUser ? (
                <div className="flex items-center justify-between px-1 py-2 border-t border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-olive-600 flex items-center justify-center text-white text-xs font-bold">
                      {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold leading-none">{currentUser.name}</p>
                      <Link to="/perfil" onClick={() => setMobileOpen(false)} className="text-olive-400 text-xs">Ver perfil</Link>
                    </div>
                  </div>
                  <button onClick={() => { logout(); setMobileOpen(false) }} className="text-white/40 hover:text-red-400 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { openModal('login'); setMobileOpen(false) }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/20 text-white/60 hover:text-white hover:border-olive-400 transition-all duration-200 text-sm font-medium"
                >
                  <User size={16} /> Iniciar sesión
                </button>
              )}
              <div className="flex items-center justify-center gap-8 text-white/40 text-sm">
                <span>WhatsApp</span>
                <span>Instagram</span>
                <span>TikTok</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-matte-black/95 backdrop-blur-lg flex items-start justify-center pt-32 px-4"
            onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch}>
                <div className="flex items-center gap-4 border-b-2 border-olive-500 pb-4">
                  <Search size={26} className="text-olive-400 flex-shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    placeholder="Buscar mates, termos, bombillas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white text-2xl outline-none placeholder-white/25 font-light"
                  />
                  <button type="button" onClick={() => setSearchOpen(false)} className="text-white/40 hover:text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>
              </form>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Mate Imperial', 'Termo Stanley', 'Bombilla alpaca', 'Kit regalo'].map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSearchQuery(s); navigate(`/shop?q=${encodeURIComponent(s)}`); setSearchOpen(false) }}
                    className="px-4 py-2 rounded-full border border-white/20 text-white/50 hover:text-white hover:border-olive-400 transition-all duration-200 text-sm"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
