import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Warehouse,
  BarChart3,
  LogOut,
  Menu,
  X,
  UserCircle,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/employees', icon: Users, label: 'Employees' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/customers', icon: UserCircle, label: 'Customers' },
  { to: '/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/inventory', icon: Warehouse, label: 'Inventory' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const userInitial =
    user?.name?.charAt(0)?.toUpperCase() || 'U'

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* =========================================================
          MOBILE OVERLAY
      ========================================================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =========================================================
          SIDEBAR
      ========================================================= */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          w-[270px]
          flex flex-col
          bg-slate-950 text-white
          border-r border-slate-800
          shadow-2xl shadow-slate-950/20
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:shadow-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >

        {/* Sidebar Header */}
        <div className="h-[72px] px-5 flex items-center justify-between border-b border-slate-800/80 shrink-0">

          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <BarChart3 size={21} className="text-white" />

              <span className="absolute -right-0.5 -top-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950" />
            </div>

            <div>
              <h1 className="text-[15px] font-bold tracking-tight text-white">
                ERP System
              </h1>

              <p className="text-[10px] uppercase tracking-[0.16em] text-slate-500 mt-0.5">
                Business Suite
              </p>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-5">

          <div className="px-3 mb-3">
            <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-slate-500">
              Main Menu
            </p>
          </div>

          <nav className="space-y-1.5">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `
                    group relative flex items-center gap-3
                    px-3 py-3 rounded-xl
                    text-sm font-medium
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-900'
                    }
                  `
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-7 rounded-r-full bg-blue-300" />
                    )}

                    <div
                      className={`
                        w-9 h-9 rounded-lg flex items-center justify-center shrink-0
                        transition-all
                        ${
                          isActive
                            ? 'bg-white/15'
                            : 'bg-slate-900 group-hover:bg-slate-800'
                        }
                      `}
                    >
                      <Icon size={18} />
                    </div>

                    <span className="flex-1">
                      {label}
                    </span>

                    {isActive && (
                      <ChevronRight
                        size={15}
                        className="text-blue-200"
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* System Status */}
          <div className="mt-7 px-1">
            <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-4">

              <div className="absolute -right-8 -top-8 w-20 h-20 rounded-full bg-blue-600/10 blur-2xl" />

              <div className="relative flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <ShieldCheck
                    size={17}
                    className="text-emerald-400"
                  />
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    System Online
                  </p>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />

                    <span className="text-[10px] text-slate-500">
                      All services operational
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =======================================================
            USER PROFILE
        ======================================================= */}
        <div className="p-3 border-t border-slate-800/80 shrink-0">

          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">

            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-sm font-bold shadow-md">
                {userInitial}
              </div>

              <span className="absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate">
                {user?.name || 'User'}
              </p>

              <p className="text-[11px] text-slate-500 capitalize truncate mt-0.5">
                {user?.role || 'User'}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="
              mt-2.5
              flex items-center gap-3
              w-full px-3 py-2.5
              rounded-xl
              text-sm font-medium text-slate-400
              hover:text-red-300
              hover:bg-red-500/10
              transition-all duration-200
              group
            "
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-900 group-hover:bg-red-500/10 transition">
              <LogOut size={16} />
            </div>

            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* =========================================================
          MAIN AREA
      ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* =======================================================
            TOP HEADER
        ======================================================= */}
        <header className="h-[72px] bg-white border-b border-slate-200 flex items-center px-4 lg:px-8 shrink-0">

          <div className="flex items-center gap-4 flex-1 min-w-0">

            {/* Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="
                lg:hidden
                w-10 h-10
                rounded-xl
                border border-slate-200
                bg-white
                flex items-center justify-center
                text-slate-600
                hover:bg-slate-50
                transition
              "
            >
              <Menu size={21} />
            </button>

            {/* Header Title */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base lg:text-lg font-bold text-slate-900 truncate">
                  Enterprise Resource Planning
                </h2>

                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wide">
                  <Sparkles size={11} />
                  ERP
                </span>
              </div>

              <p className="hidden sm:block text-xs text-slate-400 mt-0.5">
                Manage your business operations from one place
              </p>
            </div>
          </div>

          {/* Header Right */}
          <div className="flex items-center gap-3">

            {/* Status */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>

              <span className="text-xs font-medium text-slate-600">
                Online
              </span>
            </div>

            {/* User Mini Profile */}
            <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-slate-200">

              <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-slate-800 max-w-[130px] truncate">
                  {user?.name || 'User'}
                </p>

                <p className="text-[10px] text-slate-400 capitalize">
                  {user?.role || 'User'}
                </p>
              </div>

              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* =======================================================
            PAGE CONTENT
        ======================================================= */}
        <main className="flex-1 overflow-y-auto bg-slate-50">
          <div className="p-4 lg:p-7 xl:p-8 max-w-[1800px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}