import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  Plus,
  ShoppingCart,
  UserRound,
  Package,
  CalendarDays,
  CreditCard,
  Banknote,
  WalletCards,
  X,
  Trash2,
  CircleDollarSign,
  Receipt,
  Clock3,
  CheckCircle2,
  Truck,
  XCircle,
  LoaderCircle,
  ChevronDown,
} from 'lucide-react'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    customer: '',
    items: [{ product: '', quantity: 1 }],
    tax: 0,
    discount: 0,
    paymentMethod: 'cash',
  })

  const fetchData = async () => {
    try {
      setLoading(true)

      const [ordersRes, custRes, prodRes] = await Promise.all([
        api.get('/orders'),
        api.get('/customers'),
        api.get('/products'),
      ])

      setOrders(ordersRes.data.data)
      setCustomers(custRes.data.data)
      setProducts(prodRes.data.data)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const addItem = () => {
    setForm({
      ...form,
      items: [
        ...form.items,
        {
          product: '',
          quantity: 1,
        },
      ],
    })
  }

  const removeItem = (idx) => {
    if (form.items.length === 1) return

    const items = form.items.filter((_, index) => index !== idx)

    setForm({
      ...form,
      items,
    })
  }

  const updateItem = (idx, field, value) => {
    const items = [...form.items]

    items[idx][field] = value

    setForm({
      ...form,
      items,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.post('/orders', form)

      toast.success('Order created')

      setShowModal(false)

      setForm({
        customer: '',
        items: [{ product: '', quantity: 1 }],
        tax: 0,
        discount: 0,
        paymentMethod: 'cash',
      })

      fetchData()
    } catch (err) {
      toast.error(
        err.response?.data?.message || 'Error creating order'
      )
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/orders/${id}/status`, { status })

      toast.success('Status updated')

      fetchData()
    } catch {
      toast.error('Update failed')
    }
  }

  const openOrderModal = () => {
    setForm({
      customer: '',
      items: [{ product: '', quantity: 1 }],
      tax: 0,
      discount: 0,
      paymentMethod: 'cash',
    })

    setShowModal(true)
  }

  const totalOrders = orders.length

  const deliveredOrders = orders.filter(
    (o) => o.status === 'delivered'
  ).length

  const pendingOrders = orders.filter(
    (o) => o.status === 'pending'
  ).length

  const totalRevenue = orders.reduce(
    (sum, o) => sum + (o.totalAmount || 0),
    0
  )

  const getStatusConfig = (status) => {
    switch (status) {
      case 'delivered':
        return {
          icon: CheckCircle2,
          classes: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        }

      case 'pending':
        return {
          icon: Clock3,
          classes: 'bg-amber-50 text-amber-700 border-amber-100',
        }

      case 'processing':
        return {
          icon: LoaderCircle,
          classes: 'bg-blue-50 text-blue-700 border-blue-100',
        }

      case 'shipped':
        return {
          icon: Truck,
          classes: 'bg-indigo-50 text-indigo-700 border-indigo-100',
        }

      case 'cancelled':
        return {
          icon: XCircle,
          classes: 'bg-red-50 text-red-700 border-red-100',
        }

      case 'confirmed':
        return {
          icon: CheckCircle2,
          classes: 'bg-cyan-50 text-cyan-700 border-cyan-100',
        }

      default:
        return {
          icon: Clock3,
          classes: 'bg-slate-50 text-slate-600 border-slate-100',
        }
    }
  }

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'card':
        return CreditCard

      case 'bank_transfer':
        return Banknote

      case 'credit':
        return WalletCards

      default:
        return CircleDollarSign
    }
  }

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-1 rounded-full bg-gradient-to-b from-blue-600 to-indigo-600" />

            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Order Management
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Orders
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage orders, payments and fulfillment status
          </p>
        </div>

        <button
          onClick={openOrderModal}
          className="
            inline-flex items-center justify-center gap-2
            px-5 py-2.5
            rounded-xl
            text-sm font-semibold text-white
            bg-gradient-to-r from-blue-600 to-indigo-600
            shadow-lg shadow-blue-500/20
            hover:from-blue-700 hover:to-indigo-700
            hover:shadow-blue-500/30
            transition-all duration-200
          "
        >
          <Plus size={18} />
          New Order
        </button>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Orders */}
        <div className="
          relative overflow-hidden
          bg-white rounded-2xl
          border border-slate-200
          p-5 shadow-sm
          hover:shadow-md transition-shadow
        ">
          <div className="
            absolute top-0 left-0 right-0 h-1
            bg-gradient-to-r from-blue-500 to-indigo-500
          " />

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Orders
              </p>

              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {totalOrders}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                All orders
              </p>
            </div>

            <div className="
              h-11 w-11 rounded-xl
              bg-blue-50
              flex items-center justify-center
            ">
              <ShoppingCart
                size={22}
                className="text-blue-600"
              />
            </div>

          </div>
        </div>


        {/* Pending */}
        <div className="
          relative overflow-hidden
          bg-white rounded-2xl
          border border-slate-200
          p-5 shadow-sm
          hover:shadow-md transition-shadow
        ">
          <div className="
            absolute top-0 left-0 right-0 h-1
            bg-gradient-to-r from-amber-400 to-orange-500
          " />

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Pending Orders
              </p>

              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {pendingOrders}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Awaiting processing
              </p>
            </div>

            <div className="
              h-11 w-11 rounded-xl
              bg-amber-50
              flex items-center justify-center
            ">
              <Clock3
                size={22}
                className="text-amber-600"
              />
            </div>

          </div>
        </div>


        {/* Delivered */}
        <div className="
          relative overflow-hidden
          bg-white rounded-2xl
          border border-slate-200
          p-5 shadow-sm
          hover:shadow-md transition-shadow
        ">
          <div className="
            absolute top-0 left-0 right-0 h-1
            bg-gradient-to-r from-emerald-500 to-teal-500
          " />

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Delivered
              </p>

              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {deliveredOrders}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Successfully completed
              </p>
            </div>

            <div className="
              h-11 w-11 rounded-xl
              bg-emerald-50
              flex items-center justify-center
            ">
              <CheckCircle2
                size={22}
                className="text-emerald-600"
              />
            </div>

          </div>
        </div>


        {/* Revenue */}
        <div className="
          relative overflow-hidden
          bg-white rounded-2xl
          border border-slate-200
          p-5 shadow-sm
          hover:shadow-md transition-shadow
        ">
          <div className="
            absolute top-0 left-0 right-0 h-1
            bg-gradient-to-r from-violet-500 to-purple-500
          " />

          <div className="flex items-center justify-between">

            <div className="min-w-0">

              <p className="text-sm font-medium text-slate-500">
                Order Revenue
              </p>

              <h3 className="
                text-xl font-bold
                text-slate-800 mt-1
                truncate
              ">
                Rs {totalRevenue.toLocaleString()}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Total order value
              </p>

            </div>

            <div className="
              h-11 w-11 rounded-xl
              bg-violet-50
              flex items-center justify-center
              shrink-0
            ">
              <CircleDollarSign
                size={22}
                className="text-violet-600"
              />
            </div>

          </div>
        </div>

      </div>


      {/* =====================================================
          ORDERS TABLE
      ===================================================== */}
      <div className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        overflow-hidden
      ">

        {/* Table header */}
        <div className="
          px-5 py-4
          border-b border-slate-100
          flex items-center justify-between
        ">

          <div>
            <h2 className="font-semibold text-slate-800">
              Order Directory
            </h2>

            <p className="text-xs text-slate-400 mt-0.5">
              Track orders and update their fulfillment status
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {orders.length} orders
          </div>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="
                bg-slate-50/80
                border-b border-slate-100
              ">

                <th className="
                  text-left px-5 py-3.5
                  font-semibold text-slate-500
                  text-xs uppercase tracking-wider
                ">
                  Order
                </th>

                <th className="
                  text-left px-5 py-3.5
                  font-semibold text-slate-500
                  text-xs uppercase tracking-wider
                ">
                  Customer
                </th>

                <th className="
                  text-left px-5 py-3.5
                  font-semibold text-slate-500
                  text-xs uppercase tracking-wider
                ">
                  Amount
                </th>

                <th className="
                  text-left px-5 py-3.5
                  font-semibold text-slate-500
                  text-xs uppercase tracking-wider
                ">
                  Status
                </th>

                <th className="
                  text-left px-5 py-3.5
                  font-semibold text-slate-500
                  text-xs uppercase tracking-wider
                ">
                  Payment
                </th>

                <th className="
                  text-left px-5 py-3.5
                  font-semibold text-slate-500
                  text-xs uppercase tracking-wider
                ">
                  Date
                </th>

                <th className="
                  text-right px-5 py-3.5
                  font-semibold text-slate-500
                  text-xs uppercase tracking-wider
                ">
                  Actions
                </th>

              </tr>
            </thead>


            <tbody className="divide-y divide-slate-100">

              {/* Loading */}
              {loading && (
                <tr>
                  <td colSpan="7" className="py-14 text-center">

                    <div className="flex flex-col items-center">

                      <div className="
                        h-10 w-10
                        rounded-full
                        border-4 border-slate-200
                        border-t-blue-600
                        animate-spin
                      " />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading orders...
                      </p>

                    </div>

                  </td>
                </tr>
              )}


              {/* Empty */}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-14 text-center">

                    <div className="flex flex-col items-center">

                      <div className="
                        h-14 w-14
                        rounded-2xl
                        bg-slate-100
                        flex items-center justify-center
                      ">
                        <Receipt
                          size={26}
                          className="text-slate-400"
                        />
                      </div>

                      <h3 className="
                        mt-4
                        font-semibold
                        text-slate-700
                      ">
                        No orders yet
                      </h3>

                      <p className="
                        text-sm text-slate-400
                        mt-1
                      ">
                        Create your first order to get started.
                      </p>

                    </div>

                  </td>
                </tr>
              )}


              {/* Orders */}
              {!loading &&
                orders.map((o) => {

                  const statusConfig = getStatusConfig(o.status)
                  const StatusIcon = statusConfig.icon
                  const PaymentIcon = getPaymentIcon(
                    o.paymentMethod || o.paymentStatus
                  )

                  return (
                    <tr
                      key={o._id}
                      className="
                        group
                        hover:bg-slate-50/80
                        transition-colors
                      "
                    >

                      {/* Order */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="
                            h-10 w-10
                            rounded-xl
                            bg-blue-50
                            flex items-center justify-center
                            shrink-0
                          ">
                            <Receipt
                              size={18}
                              className="text-blue-600"
                            />
                          </div>

                          <div>
                            <p className="
                              font-semibold
                              text-slate-800
                            ">
                              {o.orderNumber}
                            </p>

                            <p className="
                              text-xs
                              text-slate-400
                              mt-0.5
                            ">
                              Order ID
                            </p>
                          </div>

                        </div>

                      </td>


                      {/* Customer */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="
                            h-9 w-9
                            rounded-lg
                            bg-gradient-to-br
                            from-cyan-500 to-blue-600
                            text-white
                            flex items-center justify-center
                            text-xs font-bold
                            shrink-0
                          ">
                            {(o.customer?.name || 'G')
                              .split(' ')
                              .map((word) => word[0])
                              .join('')
                              .slice(0, 2)
                              .toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="
                              font-medium
                              text-slate-700
                              truncate
                            ">
                              {o.customer?.name || '-'}
                            </p>

                            {o.customer?.customerCode && (
                              <p className="
                                text-xs
                                text-slate-400
                                font-mono
                                mt-0.5
                              ">
                                {o.customer.customerCode}
                              </p>
                            )}
                          </div>

                        </div>

                      </td>


                      {/* Amount */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <div className="
                            h-8 w-8
                            rounded-lg
                            bg-emerald-50
                            flex items-center justify-center
                          ">
                            <CircleDollarSign
                              size={15}
                              className="text-emerald-600"
                            />
                          </div>

                          <span className="
                            font-semibold
                            text-slate-800
                            whitespace-nowrap
                          ">
                            Rs {(o.totalAmount || 0).toLocaleString()}
                          </span>

                        </div>

                      </td>


                      {/* Status */}
                      <td className="px-5 py-4">

                        <span className={`
                          inline-flex
                          items-center gap-1.5
                          px-2.5 py-1.5
                          rounded-lg
                          border
                          text-xs
                          font-semibold
                          capitalize
                          ${statusConfig.classes}
                        `}>

                          <StatusIcon size={13} />

                          {o.status}

                        </span>

                      </td>


                      {/* Payment */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <PaymentIcon
                            size={15}
                            className="text-slate-400"
                          />

                          <span className="
                            text-slate-600
                            capitalize
                            text-sm
                          ">
                            {o.paymentStatus || '-'}
                          </span>

                        </div>

                      </td>


                      {/* Date */}
                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={14}
                            className="text-slate-400"
                          />

                          <span className="
                            text-xs
                            text-slate-500
                            whitespace-nowrap
                          ">
                            {new Date(
                              o.createdAt
                            ).toLocaleDateString()}
                          </span>

                        </div>

                      </td>


                      {/* Actions */}
                      <td className="px-5 py-4 text-right">

                        <div className="relative inline-block">

                          <div className="
                            flex items-center
                            border border-slate-200
                            rounded-lg
                            overflow-hidden
                            bg-white
                            hover:border-blue-300
                            transition
                          ">

                            <select
                              value={o.status}
                              onChange={(e) =>
                                updateStatus(
                                  o._id,
                                  e.target.value
                                )
                              }
                              className="
                                appearance-none
                                pl-3 pr-8 py-2
                                text-xs
                                font-medium
                                text-slate-600
                                bg-transparent
                                outline-none
                                cursor-pointer
                              "
                            >
                              {[
                                'pending',
                                'confirmed',
                                'processing',
                                'shipped',
                                'delivered',
                                'cancelled',
                              ].map((s) => (
                                <option
                                  key={s}
                                  value={s}
                                >
                                  {s}
                                </option>
                              ))}
                            </select>

                            <ChevronDown
                              size={14}
                              className="
                                absolute
                                right-2
                                pointer-events-none
                                text-slate-400
                              "
                            />

                          </div>

                        </div>

                      </td>

                    </tr>
                  )
                })}

            </tbody>

          </table>

        </div>
      </div>


      {/* =====================================================
          CREATE ORDER MODAL
      ===================================================== */}
      {showModal && (
        <div className="
          fixed inset-0
          bg-slate-950/60
          backdrop-blur-sm
          z-50
          flex items-center justify-center
          p-4
        ">

          <div className="
            bg-white
            rounded-2xl
            w-full
            max-w-2xl
            shadow-2xl
            border border-white/20
            overflow-hidden
            max-h-[90vh]
            flex flex-col
          ">

            {/* Modal Header */}
            <div className="
              px-6 py-5
              border-b border-slate-100
              flex items-center justify-between
              bg-gradient-to-r from-slate-50 to-white
              shrink-0
            ">

              <div className="flex items-center gap-3">

                <div className="
                  h-10 w-10
                  rounded-xl
                  bg-blue-50
                  flex items-center justify-center
                ">
                  <ShoppingCart
                    size={19}
                    className="text-blue-600"
                  />
                </div>

                <div>
                  <h2 className="
                    font-bold
                    text-slate-800
                  ">
                    Create Order
                  </h2>

                  <p className="
                    text-xs
                    text-slate-400
                    mt-0.5
                  ">
                    Create a new customer order
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="
                  p-2
                  rounded-lg
                  text-slate-400
                  hover:bg-slate-100
                  hover:text-slate-600
                  transition
                "
              >
                <X size={19} />
              </button>

            </div>


            {/* Modal Content */}
            <div className="overflow-y-auto">

              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5"
              >

                {/* Customer */}
                <div>

                  <label className="
                    block
                    text-xs
                    font-semibold
                    text-slate-600
                    mb-1.5
                  ">
                    Customer
                  </label>

                  <div className="relative">

                    <UserRound
                      size={17}
                      className="
                        absolute
                        left-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        pointer-events-none
                      "
                    />

                    <select
                      value={form.customer}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          customer: e.target.value,
                        })
                      }
                      className="
                        w-full
                        pl-10 pr-4 py-2.5
                        border border-slate-200
                        rounded-xl
                        text-sm
                        text-slate-700
                        bg-white
                        outline-none
                        focus:border-blue-400
                        focus:ring-4
                        focus:ring-blue-500/10
                        transition
                        appearance-none
                      "
                      required
                    >
                      <option value="">
                        Select Customer
                      </option>

                      {customers.map((c) => (
                        <option
                          key={c._id}
                          value={c._id}
                        >
                          {c.name} ({c.customerCode})
                        </option>
                      ))}

                    </select>

                    <ChevronDown
                      size={16}
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        text-slate-400
                        pointer-events-none
                      "
                    />

                  </div>

                </div>


                {/* Items */}
                <div>

                  <div className="
                    flex
                    items-center
                    justify-between
                    mb-2
                  ">

                    <div>
                      <label className="
                        text-xs
                        font-semibold
                        text-slate-600
                      ">
                        Order Items
                      </label>

                      <p className="
                        text-[11px]
                        text-slate-400
                        mt-0.5
                      ">
                        Select products and quantities
                      </p>
                    </div>

                    <span className="
                      px-2.5 py-1
                      rounded-lg
                      bg-blue-50
                      text-blue-600
                      text-xs
                      font-semibold
                    ">
                      {form.items.length}{' '}
                      {form.items.length === 1
                        ? 'Item'
                        : 'Items'}
                    </span>

                  </div>


                  <div className="space-y-3">

                    {form.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="
                          p-3
                          rounded-xl
                          border border-slate-200
                          bg-slate-50/60
                        "
                      >

                        <div className="
                          flex
                          gap-3
                          items-end
                        ">

                          {/* Product */}
                          <div className="flex-1">

                            <label className="
                              block
                              text-[11px]
                              font-medium
                              text-slate-500
                              mb-1.5
                            ">
                              Product
                            </label>

                            <div className="relative">

                              <Package
                                size={16}
                                className="
                                  absolute
                                  left-3
                                  top-1/2
                                  -translate-y-1/2
                                  text-slate-400
                                  pointer-events-none
                                "
                              />

                              <select
                                value={item.product}
                                onChange={(e) =>
                                  updateItem(
                                    idx,
                                    'product',
                                    e.target.value
                                  )
                                }
                                className="
                                  w-full
                                  pl-9 pr-8 py-2.5
                                  border border-slate-200
                                  rounded-lg
                                  bg-white
                                  text-sm
                                  outline-none
                                  focus:border-blue-400
                                  focus:ring-4
                                  focus:ring-blue-500/10
                                  appearance-none
                                "
                                required
                              >
                                <option value="">
                                  Select Product
                                </option>

                                {products.map((p) => (
                                  <option
                                    key={p._id}
                                    value={p._id}
                                  >
                                    {p.name} (Stock: {p.stock})
                                  </option>
                                ))}

                              </select>

                              <ChevronDown
                                size={14}
                                className="
                                  absolute
                                  right-3
                                  top-1/2
                                  -translate-y-1/2
                                  text-slate-400
                                  pointer-events-none
                                "
                              />

                            </div>

                          </div>


                          {/* Quantity */}
                          <div className="w-24">

                            <label className="
                              block
                              text-[11px]
                              font-medium
                              text-slate-500
                              mb-1.5
                            ">
                              Quantity
                            </label>

                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItem(
                                  idx,
                                  'quantity',
                                  +e.target.value
                                )
                              }
                              className="
                                w-full
                                border border-slate-200
                                rounded-lg
                                px-3 py-2.5
                                bg-white
                                text-sm
                                outline-none
                                focus:border-blue-400
                                focus:ring-4
                                focus:ring-blue-500/10
                              "
                              required
                            />

                          </div>


                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() =>
                              removeItem(idx)
                            }
                            disabled={
                              form.items.length === 1
                            }
                            className="
                              h-10
                              w-10
                              shrink-0
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              text-red-500
                              bg-white
                              border border-slate-200
                              hover:bg-red-50
                              hover:border-red-100
                              disabled:opacity-30
                              disabled:cursor-not-allowed
                              transition
                            "
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </div>
                    ))}

                  </div>


                  {/* Add item */}
                  <button
                    type="button"
                    onClick={addItem}
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-2
                      px-3 py-2
                      rounded-lg
                      bg-blue-50
                      text-blue-600
                      text-xs
                      font-semibold
                      hover:bg-blue-100
                      transition
                    "
                  >
                    <Plus size={15} />
                    Add Another Item
                  </button>

                </div>


                {/* Tax & Discount */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>

                    <label className="
                      block
                      text-xs
                      font-semibold
                      text-slate-600
                      mb-1.5
                    ">
                      Tax
                    </label>

                    <div className="relative">

                      <Receipt
                        size={16}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        type="number"
                        placeholder="0"
                        value={form.tax}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            tax: +e.target.value,
                          })
                        }
                        className="
                          w-full
                          pl-9 pr-3 py-2.5
                          border border-slate-200
                          rounded-xl
                          text-sm
                          outline-none
                          focus:border-blue-400
                          focus:ring-4
                          focus:ring-blue-500/10
                        "
                      />

                    </div>

                  </div>


                  <div>

                    <label className="
                      block
                      text-xs
                      font-semibold
                      text-slate-600
                      mb-1.5
                    ">
                      Discount
                    </label>

                    <div className="relative">

                      <CircleDollarSign
                        size={16}
                        className="
                          absolute
                          left-3
                          top-1/2
                          -translate-y-1/2
                          text-slate-400
                        "
                      />

                      <input
                        type="number"
                        placeholder="0"
                        value={form.discount}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            discount: +e.target.value,
                          })
                        }
                        className="
                          w-full
                          pl-9 pr-3 py-2.5
                          border border-slate-200
                          rounded-xl
                          text-sm
                          outline-none
                          focus:border-blue-400
                          focus:ring-4
                          focus:ring-blue-500/10
                        "
                      />

                    </div>

                  </div>

                </div>


                {/* Payment Method */}
                <div>

                  <label className="
                    block
                    text-xs
                    font-semibold
                    text-slate-600
                    mb-1.5
                  ">
                    Payment Method
                  </label>

                  <div className="
                    grid
                    grid-cols-2
                    sm:grid-cols-4
                    gap-2
                  ">

                    {[
                      {
                        value: 'cash',
                        label: 'Cash',
                        icon: CircleDollarSign,
                      },
                      {
                        value: 'card',
                        label: 'Card',
                        icon: CreditCard,
                      },
                      {
                        value: 'bank_transfer',
                        label: 'Bank',
                        icon: Banknote,
                      },
                      {
                        value: 'credit',
                        label: 'Credit',
                        icon: WalletCards,
                      },
                    ].map((method) => {

                      const Icon = method.icon

                      return (
                        <button
                          key={method.value}
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              paymentMethod:
                                method.value,
                            })
                          }
                          className={`
                            flex
                            flex-col
                            items-center
                            justify-center
                            gap-1.5
                            py-3
                            rounded-xl
                            border
                            transition
                            ${
                              form.paymentMethod ===
                              method.value
                                ? 'border-blue-500 bg-blue-50 text-blue-600 ring-2 ring-blue-500/10'
                                : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                            }
                          `}
                        >
                          <Icon size={18} />

                          <span className="
                            text-xs
                            font-semibold
                          ">
                            {method.label}
                          </span>

                        </button>
                      )
                    })}

                  </div>

                </div>


                {/* Actions */}
                <div className="
                  flex
                  gap-3
                  pt-4
                  border-t
                  border-slate-100
                ">

                  <button
                    type="button"
                    onClick={() =>
                      setShowModal(false)
                    }
                    className="
                      flex-1
                      py-2.5
                      rounded-xl
                      border border-slate-200
                      text-sm
                      font-semibold
                      text-slate-600
                      hover:bg-slate-50
                      transition
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="
                      flex-1
                      py-2.5
                      rounded-xl
                      text-sm
                      font-semibold
                      text-white
                      bg-gradient-to-r
                      from-blue-600
                      to-indigo-600
                      shadow-lg
                      shadow-blue-500/20
                      hover:from-blue-700
                      hover:to-indigo-700
                      transition
                    "
                  >
                    Create Order
                  </button>

                </div>

              </form>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}