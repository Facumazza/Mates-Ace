import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircle2, ShoppingBag, ClipboardList } from 'lucide-react'
import { useAuthStore } from '../store/useAuthStore'

export default function PagoExitosoPage() {
  const [params] = useSearchParams()
  const orderId = params.get('external_reference')
  const token = useAuthStore((s) => s.token)

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-matte-black mb-3">
          ¡Pago exitoso!
        </h1>
        <p className="text-matte-black/50 mb-2">
          Tu pago fue procesado correctamente.
        </p>
        {orderId && (
          <p className="text-xs text-matte-black/30 mb-8">
            Orden #{orderId}
          </p>
        )}

        <div className="bg-olive-50 rounded-2xl p-5 mb-8 text-left">
          <p className="text-sm text-olive-700 leading-relaxed">
            Estamos preparando tu pedido. Recibirás actualizaciones del estado directamente en tu perfil.
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
