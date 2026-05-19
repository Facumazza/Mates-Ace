import { useSearchParams, Link } from 'react-router-dom'
import { XCircle, ShoppingBag, RefreshCcw } from 'lucide-react'

export default function PagoFallidoPage() {
  const [params] = useSearchParams()
  const orderId = params.get('external_reference')

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-4 py-20">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>

        <h1 className="font-serif text-3xl font-bold text-matte-black mb-3">
          Pago rechazado
        </h1>
        <p className="text-matte-black/50 mb-2">
          No pudimos procesar tu pago.
        </p>
        {orderId && (
          <p className="text-xs text-matte-black/30 mb-8">
            Orden #{orderId}
          </p>
        )}

        <div className="bg-red-50 rounded-2xl p-5 mb-8 text-left">
          <p className="text-sm text-red-700 leading-relaxed">
            El pago fue rechazado o cancelado. Podés intentarlo nuevamente con otro método de pago o contactarnos si el problema persiste.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 bg-olive-600 hover:bg-olive-700 text-white font-semibold py-3.5 rounded-2xl transition-colors"
          >
            <RefreshCcw size={16} />
            Intentar de nuevo
          </Link>
          <Link
            to="/"
            className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-matte-black font-semibold py-3.5 rounded-2xl transition-colors"
          >
            <ShoppingBag size={16} />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
