
import { useEffect, useState } from 'react'
import api from '../services/api'
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  UserCircle,
  TrendingUp,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  Activity,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats')
      .then(res => setStats(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="text-red-500" size={26} />
          </div>
          <h3 className="mt-4 font-semibold text-slate-800">
            Unable to load dashboard
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Please try again later.
          </p>
        </div>
      </div>
    )
  }

  const cards = [
    {
      label: 'Employees',
      value: stats.overview.totalEmployees,
      icon: Users,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      gradient: 'from-blue-500 to-cyan-500',
      trend: 'Team members',
    },
    {
      label: 'Products',
      value: stats.overview.totalProducts,
      icon: Package,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      gradient: 'from-emerald-500 to-teal-500',
      trend: 'Inventory items',
    },
    {
      label: 'Customers',
      value: stats.overview.totalCustomers,
      icon: UserCircle,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-600',
      gradient: 'from-violet-500 to-purple-500',
      trend: 'Registered users',
    },
    {
      label: 'Orders',
      value: stats.overview.totalOrders,
      icon: ShoppingCart,
      iconBg: 'bg-orange-50',
      iconColor: 'text-orange-600',
      gradient: 'from-orange-500 to-amber-500',
      trend: 'Total orders',
    },
    {
      label: 'Revenue',
      value: `Rs ${stats.overview.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600',
      gradient: 'from-green-500 to-emerald-500',
      trend: 'Total revenue',
    },
    {
      label: 'Low Stock',
      value: stats.overview.lowStockProducts,
      icon: AlertTriangle,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      gradient: 'from-red-500 to-rose-500',
      trend: 'Needs attention',
    },
  ]

  const chartData = stats.monthlySales.map(m => ({
    name: `${m._id.month}/${m._id.year}`,
    sales: m.total,
  }))

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={17} className="text-blue-600" />

            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Overview
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Monitor your business performance and activity.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>

          <span className="text-xs font-medium text-slate-600">
            System Operational
          </span>
        </div>
      </div>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">

        {cards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.label}
              className="group relative bg-white rounded-2xl border border-slate-100 p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
            >
              {/* Top gradient line */}
              <div
                className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient}`}
              />

              <div className="flex items-start justify-between">

                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    {card.label}
                  </p>

                  <p className="text-xl xl:text-2xl font-bold text-slate-900 mt-2 truncate">
                    {card.value}
                  </p>

                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp
                      size={12}
                      className={card.iconColor}
                    />

                    <span className="text-[11px] text-slate-400">
                      {card.trend}
                    </span>
                  </div>
                </div>

                <div
                  className={`w-11 h-11 shrink-0 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconColor} group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon size={21} strokeWidth={2} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ===================================================
            SALES CHART
        =================================================== */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <TrendingUp
                    size={18}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900">
                    Monthly Sales
                  </h3>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Sales performance overview
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-xs font-medium text-slate-500">
                Sales
              </span>
            </div>

          </div>

          <div className="p-6">

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -15,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid
                    strokeDasharray="4 4"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#94a3b8',
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#94a3b8',
                      fontSize: 11,
                    }}
                  />

                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
                    }}
                    labelStyle={{
                      color: '#475569',
                      fontWeight: 600,
                    }}
                  />

                  <Bar
                    dataKey="sales"
                    fill="#3b82f6"
                    radius={[7, 7, 0, 0]}
                    maxBarSize={42}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[280px] flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <TrendingUp
                    size={24}
                    className="text-slate-300"
                  />
                </div>

                <p className="text-sm font-medium text-slate-500 mt-4">
                  No sales data yet
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Sales activity will appear here.
                </p>
              </div>
            )}

          </div>
        </div>

        {/* ===================================================
            RECENT ORDERS
        =================================================== */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

            <div className="flex items-center gap-3">

              <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center">
                <ShoppingCart
                  size={18}
                  className="text-orange-600"
                />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  Recent Orders
                </h3>

                <p className="text-xs text-slate-400 mt-0.5">
                  Latest transactions
                </p>
              </div>

            </div>

            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center">
              <ArrowUpRight
                size={16}
                className="text-slate-500"
              />
            </div>

          </div>

          <div className="p-4">

            {stats.recentOrders.length === 0 ? (
              <div className="py-12 text-center">

                <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center">
                  <ShoppingCart
                    size={23}
                    className="text-slate-300"
                  />
                </div>

                <p className="text-sm font-medium text-slate-500 mt-4">
                  No orders yet
                </p>

                <p className="text-xs text-slate-400 mt-1">
                  Recent orders will appear here.
                </p>

              </div>
            ) : (
              <div className="space-y-1">

                {stats.recentOrders.map((order) => {

                  const statusStyles =
                    order.status === 'delivered'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : order.status === 'pending'
                        ? 'bg-amber-50 text-amber-700 border-amber-100'
                        : 'bg-blue-50 text-blue-700 border-blue-100'

                  const isDelivered =
                    order.status === 'delivered'

                  return (
                    <div
                      key={order._id}
                      className="group flex items-center justify-between gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                    >

                      <div className="flex items-center gap-3 min-w-0">

                        <div className="w-10 h-10 shrink-0 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                          {isDelivered ? (
                            <CheckCircle2
                              size={18}
                              className="text-emerald-500"
                            />
                          ) : (
                            <Clock3
                              size={18}
                              className="text-slate-500"
                            />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-sm text-slate-800 truncate">
                            {order.orderNumber}
                          </p>

                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {order.customer?.name || 'N/A'}
                          </p>
                        </div>

                      </div>

                      <div className="text-right shrink-0">

                        <p className="font-bold text-sm text-slate-800">
                          Rs {order.totalAmount?.toLocaleString()}
                        </p>

                        <span
                          className={`inline-flex mt-1 text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full border ${statusStyles}`}
                        >
                          {order.status}
                        </span>

                      </div>

                    </div>
                  )
                })}

              </div>
            )}

          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM INFO
      ===================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-5 text-white shadow-lg shadow-blue-600/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Users size={20} />
            </div>

            <div>
              <p className="text-xs text-blue-100">
                Active Employees
              </p>
              <p className="text-xl font-bold mt-0.5">
                {stats.overview.totalEmployees}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg shadow-emerald-600/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Package size={20} />
            </div>

            <div>
              <p className="text-xs text-emerald-100">
                Products Available
              </p>
              <p className="text-xl font-bold mt-0.5">
                {stats.overview.totalProducts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl p-5 text-white shadow-lg shadow-violet-600/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <DollarSign size={20} />
            </div>

            <div>
              <p className="text-xs text-violet-100">
                Total Revenue
              </p>
              <p className="text-xl font-bold mt-0.5">
                Rs {stats.overview.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

