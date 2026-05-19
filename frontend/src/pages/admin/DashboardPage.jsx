import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, ShoppingBag, DollarSign, Calendar, ShoppingCart, CheckCircle2, Landmark } from 'lucide-react'
import { useOrdersStore } from '../../store/useOrdersStore'
import { useAuthStore } from '../../store/useAuthStore'
import { formatPrice } from '../../data/products'

// ── helpers ────────────────────────────────────────────────────────────────────
function startOfDay(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function daysAgoDate(n) {
  const d = startOfDay()
  d.setDate(d.getDate() - n)
  return d
}
function isSameDay(a, b) {
  return startOfDay(new Date(a)).getTime() === startOfDay(b).getTime()
}
function isWithinDays(dateStr, n) {
  return new Date(dateStr) >= daysAgoDate(n)
}

// ── bar chart ──────────────────────────────────────────────────────────────────
function BarChart({ bars }) {
  const max = Math.max(...bars.map((b) => b.value), 1)
  return (
    <div className="flex items-end gap-1.5 h-36 w-full pt-2">
      {bars.map((bar, i) => {
        const pct = (bar.value / max) * 100
        const isLast = i === bars.length - 1
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            {bar.value > 0 && (
              <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-white text-matte-black text-[10px] font-semibold px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                {formatPrice(bar.value)}
              </div>
            )}
            <div className="w-full flex items-end" style={{ height: '100%' }}>
              <motion.div
                className={`w-full rounded-t-lg ${isLast ? 'bg-olive-500' : 'bg-olive-700/50 group-hover:bg-olive-600/70'} transition-colors duration-200`}
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(pct, bar.value > 0 ? 3 : 0)}%` }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
              />
            </div>
            <span className={`text-[9px] font-medium truncate w-full text-center ${isLast ? 'text-olive-400' : 'text-white/25'}`}>
              {bar.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ── stat card ──────────────────────────────────────────────────────────────────
function StatCard({ title, value, sub, icon: Icon, accent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-center justify-between">
        <span className="text-white/40 text-xs font-semibold uppercase tracking-wider">{title}</span>
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          <Icon size={16} className="text-white" />
        </div>
      </div>
      <div>
        <p className="font-serif text-3xl font-bold text-white">{value}</p>
        {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
      </div>
    </motion.div>
  )
}

// ── empty state ────────────────────────────────────────────────────────────────
function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
        <ShoppingCart size={28} className="text-white/20" />
      </div>
      <div>
        <p className="text-white/50 font-medium">Aún no hay órdenes</p>
        <p className="text-white/25 text-sm mt-1">Las órdenes aparecerán acá cuando los clientes confirmen su compra.</p>
      </div>
    </div>
  )
}

const STATUS_LABELS = {
  pendiente:               { label: 'Pendiente',          cls: 'bg-sand-500/15 text-sand-400' },
  pendiente_transferencia: { label: 'Esperando transferencia', cls: 'bg-amber-500/15 text-amber-400' },
  procesando:              { label: 'Procesando',         cls: 'bg-olive-500/15 text-olive-400' },
  completado:              { label: 'Completado',         cls: 'bg-green-500/15 text-green-400' },
  enviado:                 { label: 'Enviado',            cls: 'bg-blue-500/15 text-blue-400' },
  cancelado:               { label: 'Cancelado',          cls: 'bg-red-500/15 text-red-400' },
}

const CHANNEL_LABELS = {
  mercadopago:  'Mercado Pago',
  transferencia: 'Transferencia',
  whatsapp:     'WhatsApp',
}

const PERIODS = [
  { label: 'Hoy',    key: 'day',   days: 1 },
  { label: 'Semana', key: 'week',  days: 7 },
  { label: 'Mes',    key: 'month', days: 30 },
]

// ── main ───────────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [period, setPeriod] = useState('week')
  const orders = useOrdersStore((s) => s.orders)
  const fetchAllOrders = useOrdersStore((s) => s.fetchAllOrders)
  const updateStatus = useOrdersStore((s) => s.updateStatus)
  const token = useAuthStore((s) => s.token)
  const now = new Date()
  const [confirming, setConfirming] = useState(null)

  const handleConfirmTransfer = async (orderId) => {
    setConfirming(orderId)
    try { await updateStatus(orderId, 'procesando', token) }
    finally { setConfirming(null) }
  }

  const pendingTransfers = orders.filter((o) => o.status === 'pendiente_transferencia')

  useEffect(() => { fetchAllOrders(token) }, [token])

  const ordersToday = orders.filter((o) => isSameDay(o.date, startOfDay()))
  const ordersWeek  = orders.filter((o) => isWithinDays(o.date, 7))
  const ordersMonth = orders.filter((o) => isWithinDays(o.date, 30))

  const salesDay   = ordersToday.reduce((s, o) => s + o.total, 0)
  const salesWeek  = ordersWeek.reduce((s, o) => s + o.total, 0)
  const salesMonth = ordersMonth.reduce((s, o) => s + o.total, 0)

  const periodOrders = period === 'day' ? ordersToday : period === 'week' ? ordersWeek : ordersMonth
  const periodSales  = period === 'day' ? salesDay    : period === 'week' ? salesWeek  : salesMonth

  // Chart: daily bars for last 7 or 30 days
  const chartDays = period === 'month' ? 30 : 7
  const chartBars = useMemo(() => {
    return Array.from({ length: chartDays }, (_, i) => {
      const dayOffset = chartDays - 1 - i
      const dayDate = daysAgoDate(dayOffset)
      const dayOrders = orders.filter((o) => isSameDay(o.date, dayDate))
      const value = dayOrders.reduce((s, o) => s + o.total, 0)
      const label = period === 'month'
        ? `${dayDate.getDate()}/${dayDate.getMonth() + 1}`
        : ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'][dayDate.getDay()]
      return { label, value }
    })
  }, [orders, period, chartDays])

  // Top products (mes)
  const topProducts = useMemo(() => {
    const map = {}
    ordersMonth.forEach((o) => {
      o.items.forEach((item) => {
        const key = item.productId ?? item.productName
        if (!map[key]) map[key] = { name: item.productName, qty: 0, revenue: 0 }
        map[key].qty += item.quantity
        map[key].revenue += (item.productPrice ?? 0) * item.quantity
      })
    })
    return Object.values(map).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [ordersMonth])

  return (
    <div className="flex flex-col gap-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-white/30 text-sm mt-1">
            {now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center bg-white/5 border border-white/10 rounded-xl p-1 gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                period === p.key
                  ? 'bg-olive-600 text-white shadow-lg shadow-olive-600/20'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Pending transfers alert */}
      {pendingTransfers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl px-5 py-4"
        >
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center flex-shrink-0">
            <Landmark size={16} className="text-amber-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-amber-400 font-semibold text-sm">
              {pendingTransfers.length === 1
                ? '1 transferencia esperando confirmación'
                : `${pendingTransfers.length} transferencias esperando confirmación`}
            </p>
            <p className="text-amber-400/60 text-xs mt-0.5">Confirmá el pago desde la tabla de órdenes.</p>
          </div>
        </motion.div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Ventas hoy"    value={formatPrice(salesDay)}   sub={`${ordersToday.length} orden${ordersToday.length !== 1 ? 'es' : ''}`}  icon={DollarSign}  accent="bg-olive-700"   delay={0}    />
        <StatCard title="Esta semana"   value={formatPrice(salesWeek)}  sub={`${ordersWeek.length} órdenes`}   icon={TrendingUp}  accent="bg-sand-700"    delay={0.05} />
        <StatCard title="Este mes"      value={formatPrice(salesMonth)} sub={`${ordersMonth.length} órdenes`}  icon={Calendar}    accent="bg-leather-700" delay={0.1}  />
        <StatCard title="Total órdenes" value={orders.length}           sub="Desde el inicio"                  icon={ShoppingBag} accent="bg-white/10"    delay={0.15} />
      </div>

      {/* Chart + Top products */}
      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          className="lg:col-span-2 bg-[#1A1A1A] border border-white/5 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">Ventas</h2>
              <p className="text-white/30 text-xs mt-0.5">
                {period === 'month' ? 'Últimos 30 días' : 'Últimos 7 días'}
              </p>
            </div>
            <div className="text-right">
              <p className="font-serif text-xl font-bold text-white">{formatPrice(periodSales)}</p>
              <p className="text-white/30 text-xs">{periodOrders.length} órdenes</p>
            </div>
          </div>
          {orders.length === 0 ? (
            <div className="flex items-center justify-center h-36 text-white/20 text-sm">
              Sin datos aún
            </div>
          ) : (
            <BarChart bars={chartBars} />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          className="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6"
        >
          <h2 className="font-semibold text-white mb-5">
            Top productos <span className="text-white/30 font-normal text-xs">(este mes)</span>
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-white/25 text-sm">Sin datos aún</p>
          ) : (
            <div className="flex flex-col gap-4">
              {topProducts.map(({ name, qty, revenue }, i) => {
                const maxRev = topProducts[0]?.revenue || 1
                return (
                  <div key={name} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-white/20 text-xs font-bold w-4 flex-shrink-0">#{i + 1}</span>
                        <span className="text-white text-xs font-medium truncate">{name}</span>
                      </div>
                      <span className="text-olive-400 text-xs font-semibold flex-shrink-0 ml-2">{formatPrice(revenue)}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-olive-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(revenue / maxRev) * 100}%` }}
                        transition={{ duration: 0.6, delay: 0.3 + i * 0.08 }}
                      />
                    </div>
                    <span className="text-white/25 text-[10px]">{qty} unidad{qty !== 1 ? 'es' : ''}</span>
                  </div>
                )
              })}
            </div>
          )}
        </motion.div>
      </div>

      {/* Orders table */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
        className="bg-[#1A1A1A] border border-white/5 rounded-2xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold text-white">Órdenes recientes</h2>
          <span className="text-white/30 text-xs">{orders.length} en total</span>
        </div>

        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  {['#', 'Productos', 'Cliente', 'Canal', 'Total', 'Estado', 'Fecha', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-white/25">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 20).map((order, i) => {
                  const st = STATUS_LABELS[order.status] || STATUS_LABELS.pendiente
                  const date = new Date(order.date)
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: 0.35 + i * 0.03 }}
                      className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors duration-150"
                    >
                      <td className="px-5 py-4 text-white/30 text-xs font-mono">#{order.id}</td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-0.5">
                          {order.items.slice(0, 2).map((item, j) => (
                            <span key={j} className="text-white text-xs truncate max-w-[180px]">
                              {item.productName} ×{item.quantity}
                            </span>
                          ))}
                          {order.items.length > 2 && (
                            <span className="text-white/30 text-[10px]">+{order.items.length - 2} más</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {order.shippingFirstName ? (
                          <div className="flex flex-col gap-0.5">
                            <span className="text-white text-xs font-medium">
                              {order.shippingFirstName} {order.shippingLastName}
                            </span>
                            <span className="text-white/35 text-[10px]">{order.shippingPhone}</span>
                            <span className="text-white/35 text-[10px] max-w-[160px] truncate">{order.shippingAddress}</span>
                          </div>
                        ) : (
                          <span className="text-white/20 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-white/40 text-xs">
                        {CHANNEL_LABELS[order.channel] || order.channel}
                      </td>
                      <td className="px-5 py-4 text-olive-400 text-sm font-semibold">{formatPrice(order.total)}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold ${st.cls}`}>
                          {st.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-white/30 text-xs">
                        {date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: '2-digit' })}{' '}
                        <span className="text-white/15">{date.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td className="px-5 py-4">
                        {order.status === 'pendiente_transferencia' && (
                          <div className="flex flex-col gap-1.5">
                            <p className="text-white/40 text-[10px]">
                              Verificar titular:
                            </p>
                            <p className="text-amber-300 text-xs font-semibold">
                              {order.shippingFirstName} {order.shippingLastName}
                            </p>
                            <button
                              onClick={() => handleConfirmTransfer(order.id)}
                              disabled={confirming === order.id}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-semibold transition-all duration-200 disabled:opacity-50 whitespace-nowrap"
                            >
                              {confirming === order.id ? (
                                <span className="w-3 h-3 border border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
                              ) : (
                                <CheckCircle2 size={12} />
                              )}
                              Confirmar pago
                            </button>
                          </div>
                        )}
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  )
}
