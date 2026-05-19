import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuthStore } from './store/useAuthStore'
import { useWishlistStore } from './store/useWishlistStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartSidebar from './components/CartSidebar'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductPage from './pages/ProductPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import WishlistPage from './pages/WishlistPage'
import ProfilePage from './pages/ProfilePage'
import RequireAdmin from './components/RequireAdmin'
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import ProductsAdminPage from './pages/admin/ProductsAdminPage'
import ProductFormPage from './pages/admin/ProductFormPage'
import ReviewsAdminPage from './pages/admin/ReviewsAdminPage'
import PagoExitosoPage from './pages/PagoExitosoPage'
import PagoFallidoPage from './pages/PagoFallidoPage'
import PagoPendientePage from './pages/PagoPendientePage'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function StoreLayout() {
  const token = useAuthStore((s) => s.token)
  const fetchWishlist = useWishlistStore((s) => s.fetchWishlist)
  const clearWishlist = useWishlistStore((s) => s.clear)

  useEffect(() => {
    if (token) fetchWishlist(token)
    else clearWishlist()
  }, [token])

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <CartSidebar />
      <AuthModal />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/producto/:slug" element={<ProductPage />} />
          <Route path="/nosotros" element={<AboutPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/pago/exitoso" element={<PagoExitosoPage />} />
          <Route path="/pago/fallido" element={<PagoFallidoPage />} />
          <Route path="/pago/pendiente" element={<PagoPendientePage />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin */}
        <Route path="/admin">
          <Route index element={<AdminLogin />} />
          <Route element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="productos" element={<ProductsAdminPage />} />
            <Route path="productos/nuevo" element={<ProductFormPage />} />
            <Route path="productos/editar/:id" element={<ProductFormPage />} />
            <Route path="ordenes" element={<DashboardPage />} />
            <Route path="resenas" element={<ReviewsAdminPage />} />
          </Route>
        </Route>

        {/* Tienda pública */}
        <Route path="*" element={<StoreLayout />} />
      </Routes>
    </BrowserRouter>
  )
}
