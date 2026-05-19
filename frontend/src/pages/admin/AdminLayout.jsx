import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, Package, LogOut, ChevronRight, ExternalLink,
  PlusCircle, Menu, X
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import clsx from 'clsx'

const NAV = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Productos',  href: '/admin/productos',  icon: Package },
  { label: 'Nuevo producto', href: '/admin/productos/nuevo', icon: PlusCircle },
]

export default function AdminLayout() {
  const currentUser = useAuthStore((s) => s.currentUser)
  const logout = useAuthStore((s) => s.logout)
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-olive-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <p className="font-serif font-bold text-white text-sm tracking-wider">MATES ACE</p>
            <p className="text-white/30 text-[10px] uppercase tracking-wider">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = location.pathname === href
          return (
            <Link
              key={href}
              to={href}
              onClick={() => setSidebarOpen(false)}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-olive-600 text-white shadow-lg shadow-olive-600/20'
                  : 'text-white/50 hover:text-white hover:bg-white/5'
              )}
            >
              <Icon size={17} />
              {label}
              {active && <ChevronRight size={13} className="ml-auto" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 flex flex-col gap-2 border-t border-white/10 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all duration-200"
        >
          <ExternalLink size={15} />
          Ver tienda
        </a>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-400/60 hover:text-red-400 hover:bg-red-400/5 transition-all duration-200 w-full text-left"
        >
          <LogOut size={15} />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 bg-[#161616] border-r border-white/5 flex-col">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed inset-y-0 left-0 z-50 w-60 bg-[#161616] border-r border-white/5 lg:hidden"
          >
            <SidebarContent />
          </motion.aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-14 border-b border-white/5 bg-[#161616] flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-olive-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {currentUser?.name?.[0]?.toUpperCase() ?? 'A'}
              </span>
            </div>
            <span className="text-white/50 text-sm hidden sm:block">{currentUser?.name ?? 'Admin'}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
