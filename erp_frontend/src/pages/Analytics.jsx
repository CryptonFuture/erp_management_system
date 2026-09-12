import { useEffect, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  BarChart3,
  TrendingUp,
  Package,
  AlertTriangle,
  Activity,
  BrainCircuit,
  Sparkles,
  ArrowUpRight,
  Boxes,
  ShieldCheck,
  CircleAlert,
  Zap,
} from 'lucide-react'

const PYTHON_API = 'https://erppython-service.vercel.app'

export default function Analytics() {
  const [sales, setSales] = useState(null)
  const [inventory, setInventory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get(`${PYTHON_API}/reports/sales-summary`).catch(() => null),
      axios.get(`${PYTHON_API}/reports/inventory-analysis`).catch(() => null),
    ])
      .then(([salesRes, invRes]) => {
        if (salesRes) setSales(salesRes.data.data)
        if (invRes) setInventory(invRes.data.data)

        if (!salesRes && !invRes) {
          toast.error('Python analytics service is not running on port 8000')
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-6 h-6 text-white animate-pulse" />
            </div>

            <div className="absolute -inset-1 rounded-2xl border-2 border-blue-500/20 animate-ping" />
          </div>

          <div className="text-center">
            <p className="font-semibold text-slate-800">
              Loading analytics
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Processing your business insights...
            </p>
          </div>
        </div>
      </div>
    )
  }

  const healthScore = inventory?.inventory_health_score ?? 0

  const healthColor =
    healthScore >= 80
      ? 'emerald'
      : healthScore >= 60
        ? 'amber'
        : 'red'

  const healthText =
    healthScore >= 80
      ? 'Healthy'
      : healthScore >= 60
        ? 'Needs Attention'
        : 'Critical'

  return (
    <div className="space-y-6 pb-8">

      {/* =========================================================
          HEADER
      ========================================================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-950 via-blue-950 to-indigo-950 p-6 shadow-xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -bottom-28 left-1/3 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-blue-200 text-xs font-semibold mb-3">
              <Sparkles size={13} />
              AI Powered Business Intelligence
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Analytics & Insights
            </h1>

            <p className="text-sm text-slate-300 mt-2 max-w-2xl">
              Monitor sales performance, inventory health and intelligent
              business recommendations from your analytics engine.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </span>

              <span className="text-xs font-semibold text-emerald-300">
                Analytics Engine Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          OFFLINE STATE
      ========================================================= */}
      {!sales && !inventory && (
        <div className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <CircleAlert className="text-amber-600" size={24} />
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-amber-900">
                Python Analytics Service Offline
              </h3>

              <p className="text-sm text-amber-700 mt-1">
                Start the FastAPI analytics microservice to view business
                intelligence and inventory insights.
              </p>

              <div className="mt-3 inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 border border-amber-200">
                <code className="text-xs text-amber-900 font-mono">
                  cd python-service && uvicorn main:app --reload --port 8000
                </code>
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center w-12 h-12 rounded-xl bg-white/70 border border-amber-200">
              <Zap size={20} className="text-amber-600" />
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SALES SUMMARY
      ========================================================= */}
      {sales && (
        <section className="space-y-5">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <TrendingUp size={18} className="text-blue-600" />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  Sales Performance
                </h2>
              </div>

              <p className="text-sm text-slate-500 mt-1 ml-11">
                Overview of revenue and order performance
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-2 rounded-lg w-fit">
              <Activity size={14} />
              Live Analytics
            </div>
          </div>

          {/* Sales Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Revenue */}
            <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <TrendingUp size={21} className="text-blue-600" />
                  </div>

                  <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight size={13} />
                    Revenue
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-500">
                  Total Revenue
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  Rs {sales.total_revenue?.toLocaleString()}
                </p>

                <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[78%] bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" />
                </div>
              </div>
            </div>

            {/* Orders */}
            <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    <Boxes size={21} className="text-emerald-600" />
                  </div>

                  <span className="text-xs font-semibold text-slate-400">
                    Orders
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-500">
                  Total Orders
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  {sales.total_orders?.toLocaleString()}
                </p>

                <div className="mt-4 flex items-center gap-2">
                  <div className="h-2 flex-1 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full w-[65%] rounded-full bg-emerald-500" />
                  </div>

                  <span className="text-xs text-slate-400">
                    Orders
                  </span>
                </div>
              </div>
            </div>

            {/* Average */}
            <div className="group relative overflow-hidden bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
              <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl" />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-11 h-11 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                    <BarChart3 size={21} className="text-violet-600" />
                  </div>

                  <span className="text-xs font-semibold text-violet-600 bg-violet-50 px-2 py-1 rounded-lg">
                    Average
                  </span>
                </div>

                <p className="text-sm font-medium text-slate-500">
                  Avg Order Value
                </p>

                <p className="text-2xl font-bold text-slate-900 mt-1">
                  Rs {sales.average_order_value?.toLocaleString()}
                </p>

                <div className="mt-4 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-[58%] bg-gradient-to-r from-violet-500 to-purple-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-900">
                  Top Performing Products
                </h3>

                <p className="text-xs text-slate-500 mt-1">
                  Products generating the highest revenue
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Package size={14} />
                Revenue Analysis
              </div>
            </div>

            <div className="p-5">
              {sales.top_products?.length ? (
                <div className="space-y-3">
                  {sales.top_products.map((p, i) => (
                    <div
                      key={i}
                      className="group flex items-center gap-4 p-3.5 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/40 transition-all"
                    >
                      {/* Rank */}
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-blue-600">
                          #{i + 1}
                        </span>
                      </div>

                      {/* Product */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">
                          {p.name}
                        </p>

                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">
                            {p.units} units sold
                          </span>

                          <span className="w-1 h-1 rounded-full bg-slate-300" />

                          <span className="text-xs text-slate-400">
                            Top product
                          </span>
                        </div>
                      </div>

                      {/* Revenue */}
                      <div className="text-right shrink-0">
                        <p className="font-bold text-slate-900">
                          Rs {p.revenue?.toLocaleString()}
                        </p>

                        <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                          Revenue generated
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-slate-500">
                  No product analytics available.
                </div>
              )}
            </div>

            {sales.engine && (
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                <BrainCircuit size={14} className="text-indigo-500" />

                <span className="text-xs text-slate-500">
                  Analytics Engine:
                </span>

                <span className="text-xs font-semibold text-slate-700">
                  {sales.engine}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* =========================================================
          INVENTORY ANALYSIS
      ========================================================= */}
      {inventory && (
        <section className="space-y-5">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <Package size={18} className="text-indigo-600" />
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  Inventory Intelligence
                </h2>
              </div>

              <p className="text-sm text-slate-500 mt-1 ml-11">
                AI-driven inventory health and optimization
              </p>
            </div>

            <div
              className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg w-fit ${
                healthColor === 'emerald'
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                  : healthColor === 'amber'
                    ? 'text-amber-700 bg-amber-50 border border-amber-100'
                    : 'text-red-700 bg-red-50 border border-red-100'
              }`}
            >
              <Activity size={14} />
              Inventory {healthText}
            </div>
          </div>

          {/* Inventory Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* SKUs */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <Package size={21} className="text-slate-600" />
                </div>

                <span className="text-xs font-semibold text-slate-400">
                  Inventory
                </span>
              </div>

              <p className="text-sm text-slate-500 mt-4">
                Total SKUs
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-1">
                {inventory.total_sku?.toLocaleString()}
              </p>
            </div>

            {/* Low Stock */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
                  <AlertTriangle size={21} className="text-red-600" />
                </div>

                <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                  Attention
                </span>
              </div>

              <p className="text-sm text-slate-500 mt-4">
                Low Stock Items
              </p>

              <p className="text-2xl font-bold text-red-600 mt-1">
                {inventory.low_stock_items?.toLocaleString()}
              </p>
            </div>

            {/* Health */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                    healthColor === 'emerald'
                      ? 'bg-emerald-50 border border-emerald-100'
                      : healthColor === 'amber'
                        ? 'bg-amber-50 border border-amber-100'
                        : 'bg-red-50 border border-red-100'
                  }`}
                >
                  <ShieldCheck
                    size={21}
                    className={
                      healthColor === 'emerald'
                        ? 'text-emerald-600'
                        : healthColor === 'amber'
                          ? 'text-amber-600'
                          : 'text-red-600'
                    }
                  />
                </div>

                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                    healthColor === 'emerald'
                      ? 'text-emerald-700 bg-emerald-50'
                      : healthColor === 'amber'
                        ? 'text-amber-700 bg-amber-50'
                        : 'text-red-700 bg-red-50'
                  }`}
                >
                  {healthText}
                </span>
              </div>

              <p className="text-sm text-slate-500 mt-4">
                Inventory Health Score
              </p>

              <div className="flex items-end gap-2 mt-1">
                <p className="text-2xl font-bold text-slate-900">
                  {healthScore}%
                </p>

                <span className="text-xs text-slate-400 mb-1">
                  overall health
                </span>
              </div>

              <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    healthColor === 'emerald'
                      ? 'bg-emerald-500'
                      : healthColor === 'amber'
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min(100, Math.max(0, healthScore))}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* =====================================================
              RECOMMENDATIONS
          ===================================================== */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 flex items-center justify-center">
                  <BrainCircuit size={20} className="text-indigo-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    Smart Recommendations
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Insights generated by your inventory analytics engine
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5">
              {inventory.recommendations?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {inventory.recommendations.map((r, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 hover:bg-blue-50/40 transition-all"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                        <Sparkles size={15} className="text-blue-600" />
                      </div>

                      <p className="text-sm leading-6 text-slate-700">
                        {r}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  No recommendations available.
                </p>
              )}
            </div>
          </div>

          {/* =====================================================
              ABC ANALYSIS
          ===================================================== */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

            <div className="px-5 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center">
                  <BarChart3 size={20} className="text-violet-600" />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    ABC Inventory Analysis
                  </h3>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Product classification based on inventory importance
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* A */}
              <div className="rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-white overflow-hidden">
                <div className="p-4 border-b border-red-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-red-500">
                        Category A
                      </span>

                      <h4 className="text-lg font-bold text-red-800 mt-1">
                        High Priority
                      </h4>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                      <span className="font-bold text-red-600">A</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {inventory.abc_analysis?.A_items?.length ? (
                    inventory.abc_analysis.A_items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-red-700 bg-white/70 rounded-lg px-3 py-2 border border-red-100"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-red-400">
                      No A items
                    </p>
                  )}
                </div>
              </div>

              {/* B */}
              <div className="rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white overflow-hidden">
                <div className="p-4 border-b border-amber-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-500">
                        Category B
                      </span>

                      <h4 className="text-lg font-bold text-amber-800 mt-1">
                        Medium Priority
                      </h4>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <span className="font-bold text-amber-600">B</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {inventory.abc_analysis?.B_items?.length ? (
                    inventory.abc_analysis.B_items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-amber-700 bg-white/70 rounded-lg px-3 py-2 border border-amber-100"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-amber-400">
                      No B items
                    </p>
                  )}
                </div>
              </div>

              {/* C */}
              <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white overflow-hidden">
                <div className="p-4 border-b border-emerald-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                        Category C
                      </span>

                      <h4 className="text-lg font-bold text-emerald-800 mt-1">
                        Low Priority
                      </h4>
                    </div>

                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <span className="font-bold text-emerald-600">C</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  {inventory.abc_analysis?.C_items?.length ? (
                    inventory.abc_analysis.C_items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-sm text-emerald-700 bg-white/70 rounded-lg px-3 py-2 border border-emerald-100"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span className="truncate">{item}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-emerald-400">
                      No C items
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

        </section>
      )}
    </div>
  )
}