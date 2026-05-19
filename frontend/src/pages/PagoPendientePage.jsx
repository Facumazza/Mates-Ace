import { useSearchParams, Link } from 'react-router-dom'
import { Clock, ShoppingBag, ClipboardList } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

export default function PagoPendientePage() {
  const [params] = useSearchParams()
  const orderId = params.get('external_reference')
  const token = useAuthStore((s) => s.token)

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
          <Clock size={40} className="text-amber-500" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-matte-black mb-3">
          Pago pendiente
        </h1>
        <p className="text-matte-black/50 mb-2">
          Tu pago está siendo procesado.
        </p>
        {orderId && (
          <p className="text-xs text-matte-black/30 mb-8">
            Orden #{orderId}
          </p>
        )}

        <div className="bg-amber-50 rounded-2xl p-5 mb-8 text-left">
          <p className="text-sm text-amber-700 leading-relaxed">
            El pago aún no fue confirmado. Esto puede tardar unos minutos o hasta 2 días hábiles según el método elegido. Te notificaremos cuando se acredite.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {token && (
            <Link
              to="/perfil"
              className="flex items-center justify-center gap-2 bg-olive-600 hover:bg-olive-700 text-white font-semibold py-3.5 rounded-2xl transition-colors"
            >
              <ClipboardList size={16} />
              Ver mis pedidos
            </Link>
          )}
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-matte-black font-semibold py-3.5 rounded-2xl transition-colors"
          >
            <ShoppingBag size={16} />
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  )
}
