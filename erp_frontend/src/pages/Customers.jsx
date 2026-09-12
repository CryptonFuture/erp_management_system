import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  UserRound,
  Building2,
  ShoppingCart,
  Mail,
  Phone,
  X,
  BriefcaseBusiness,
  User,
} from 'lucide-react'

export default function Customers() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    type: 'individual',
  })
  const [editId, setEditId] = useState(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/customers', { params: { search } })
      setCustomers(data.data)
    } catch {
      toast.error('Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [search])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editId) {
        await api.put(`/customers/${editId}`, form)
        toast.success('Customer updated')
      } else {
        await api.post('/customers', form)
        toast.success('Customer created')
      }

      setShowModal(false)
      setEditId(null)
      setForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        type: 'individual',
      })

      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    }
  }

  const handleEdit = (c) => {
    setForm({
      name: c.name,
      email: c.email || '',
      phone: c.phone || '',
      company: c.company || '',
      type: c.type,
    })

    setEditId(c._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return

    try {
      await api.delete(`/customers/${id}`)
      toast.success('Deleted')
      fetchData()
    } catch {
      toast.error('Delete failed')
    }
  }

  const openAddModal = () => {
    setEditId(null)
    setForm({
      name: '',
      email: '',
      phone: '',
      company: '',
      type: 'individual',
    })
    setShowModal(true)
  }

  const individualCount = customers.filter(
    (c) => c.type === 'individual'
  ).length

  const businessCount = customers.filter(
    (c) => c.type === 'business'
  ).length

  const totalOrders = customers.reduce(
    (sum, c) => sum + (c.totalOrders || 0),
    0
  )

  const getInitials = (name = '') => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
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
              Customer Management
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800">
            Customers
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your customer relationships and orders
          </p>
        </div>

        <button
          onClick={openAddModal}
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
          Add Customer
        </button>
      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Customers
              </p>

              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {customers.length}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Customer records
              </p>
            </div>

            <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users className="text-blue-600" size={22} />
            </div>
          </div>
        </div>

        {/* Individuals */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Individuals
              </p>

              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {individualCount}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Personal customers
              </p>
            </div>

            <div className="h-11 w-11 rounded-xl bg-cyan-50 flex items-center justify-center">
              <UserRound className="text-cyan-600" size={22} />
            </div>
          </div>
        </div>

        {/* Business */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 to-purple-500" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Businesses
              </p>

              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {businessCount}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Business customers
              </p>
            </div>

            <div className="h-11 w-11 rounded-xl bg-violet-50 flex items-center justify-center">
              <Building2 className="text-violet-600" size={22} />
            </div>
          </div>
        </div>

        {/* Orders */}
        <div className="relative overflow-hidden bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Total Orders
              </p>

              <h3 className="text-2xl font-bold text-slate-800 mt-1">
                {totalOrders}
              </h3>

              <p className="text-xs text-slate-400 mt-1">
                Customer orders
              </p>
            </div>

            <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <ShoppingCart className="text-emerald-600" size={22} />
            </div>
          </div>
        </div>

      </div>


      {/* =====================================================
          SEARCH
      ===================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">

        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={19}
          />

          <input
            type="text"
            placeholder="Search customers by name, email, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full
              pl-11 pr-4 py-3
              bg-slate-50
              border border-slate-200
              rounded-xl
              text-sm
              text-slate-700
              placeholder:text-slate-400
              outline-none
              focus:bg-white
              focus:border-blue-400
              focus:ring-4
              focus:ring-blue-500/10
              transition-all
            "
          />
        </div>

      </div>


      {/* =====================================================
          CUSTOMER TABLE
      ===================================================== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Table Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-slate-800">
              Customer Directory
            </h2>

            <p className="text-xs text-slate-400 mt-0.5">
              View and manage customer information
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {customers.length} records
          </div>
        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">

                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Customer
                </th>

                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Contact
                </th>

                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Company
                </th>

                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Type
                </th>

                <th className="text-left px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Orders
                </th>

                <th className="text-right px-5 py-3.5 font-semibold text-slate-500 text-xs uppercase tracking-wider">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {/* Loading */}
              {loading && (
                <tr>
                  <td colSpan="6" className="py-14 text-center">

                    <div className="flex flex-col items-center justify-center">

                      <div className="h-10 w-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />

                      <p className="mt-3 text-sm text-slate-500">
                        Loading customers...
                      </p>

                    </div>

                  </td>
                </tr>
              )}

              {/* Empty */}
              {!loading && customers.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-14 text-center">

                    <div className="flex flex-col items-center">

                      <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <Users
                          size={26}
                          className="text-slate-400"
                        />
                      </div>

                      <h3 className="mt-4 font-semibold text-slate-700">
                        No customers found
                      </h3>

                      <p className="text-sm text-slate-400 mt-1">
                        Try changing your search or add a new customer.
                      </p>

                    </div>

                  </td>
                </tr>
              )}

              {/* Customers */}
              {!loading &&
                customers.map((c) => (
                  <tr
                    key={c._id}
                    className="
                      group
                      hover:bg-slate-50/80
                      transition-colors
                    "
                  >

                    {/* Customer */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="
                          h-10 w-10
                          shrink-0
                          rounded-xl
                          bg-gradient-to-br from-blue-500 to-indigo-600
                          text-white
                          flex items-center justify-center
                          text-xs font-bold
                          shadow-sm
                        ">
                          {getInitials(c.name)}
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-slate-800 truncate">
                            {c.name}
                          </p>

                          <p className="text-xs text-slate-400 font-mono mt-0.5">
                            {c.customerCode}
                          </p>

                        </div>

                      </div>

                    </td>


                    {/* Contact */}
                    <td className="px-5 py-4">

                      <div className="space-y-1">

                        {c.email && (
                          <div className="flex items-center gap-2 text-xs text-slate-600">
                            <Mail size={13} className="text-slate-400" />
                            <span>{c.email}</span>
                          </div>
                        )}

                        {c.phone && (
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <Phone size={13} className="text-slate-400" />
                            <span>{c.phone}</span>
                          </div>
                        )}

                        {!c.email && !c.phone && (
                          <span className="text-xs text-slate-400">
                            No contact details
                          </span>
                        )}

                      </div>

                    </td>


                    {/* Company */}
                    <td className="px-5 py-4">

                      {c.company ? (
                        <div className="flex items-center gap-2">

                          <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center">
                            <Building2
                              size={15}
                              className="text-slate-500"
                            />
                          </div>

                          <span className="font-medium text-slate-700">
                            {c.company}
                          </span>

                        </div>
                      ) : (
                        <span className="text-slate-400">
                          —
                        </span>
                      )}

                    </td>


                    {/* Type */}
                    <td className="px-5 py-4">

                      {c.type === 'business' ? (
                        <span className="
                          inline-flex items-center gap-1.5
                          px-2.5 py-1.5
                          rounded-lg
                          bg-violet-50
                          text-violet-700
                          text-xs font-semibold
                          capitalize
                        ">
                          <BriefcaseBusiness size={13} />
                          Business
                        </span>
                      ) : (
                        <span className="
                          inline-flex items-center gap-1.5
                          px-2.5 py-1.5
                          rounded-lg
                          bg-blue-50
                          text-blue-700
                          text-xs font-semibold
                          capitalize
                        ">
                          <User size={13} />
                          Individual
                        </span>
                      )}

                    </td>


                    {/* Orders */}
                    <td className="px-5 py-4">

                      <div className="inline-flex items-center gap-2">

                        <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <ShoppingCart
                            size={14}
                            className="text-emerald-600"
                          />
                        </div>

                        <span className="font-semibold text-slate-700">
                          {c.totalOrders || 0}
                        </span>

                      </div>

                    </td>


                    {/* Actions */}
                    <td className="px-5 py-4 text-right">

                      <div className="flex justify-end items-center gap-1">

                        <button
                          onClick={() => handleEdit(c)}
                          title="Edit customer"
                          className="
                            p-2
                            rounded-lg
                            text-blue-600
                            hover:bg-blue-50
                            hover:text-blue-700
                            transition-colors
                          "
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(c._id)}
                          title="Delete customer"
                          className="
                            p-2
                            rounded-lg
                            text-red-500
                            hover:bg-red-50
                            hover:text-red-600
                            transition-colors
                          "
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

            </tbody>

          </table>

        </div>
      </div>


      {/* =====================================================
          ADD / EDIT MODAL
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
            max-w-lg
            shadow-2xl
            border border-white/20
            overflow-hidden
          ">

            {/* Modal Header */}
            <div className="
              px-6 py-5
              border-b border-slate-100
              flex items-center justify-between
              bg-gradient-to-r from-slate-50 to-white
            ">

              <div className="flex items-center gap-3">

                <div className="
                  h-10 w-10
                  rounded-xl
                  bg-blue-50
                  flex items-center justify-center
                ">
                  {editId ? (
                    <Pencil size={19} className="text-blue-600" />
                  ) : (
                    <UserRound size={19} className="text-blue-600" />
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-slate-800">
                    {editId ? 'Edit Customer' : 'Add Customer'}
                  </h2>

                  <p className="text-xs text-slate-400 mt-0.5">
                    {editId
                      ? 'Update customer information'
                      : 'Create a new customer record'}
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


            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Customer Name
                </label>

                <div className="relative">
                  <UserRound
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    placeholder="Enter customer name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    className="
                      w-full
                      pl-10 pr-3 py-2.5
                      border border-slate-200
                      rounded-xl
                      text-sm
                      outline-none
                      focus:border-blue-400
                      focus:ring-4
                      focus:ring-blue-500/10
                      transition
                    "
                    required
                  />
                </div>
              </div>


              {/* Email + Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="email"
                      placeholder="customer@email.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          email: e.target.value,
                        })
                      }
                      className="
                        w-full
                        pl-10 pr-3 py-2.5
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
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Phone
                  </label>

                  <div className="relative">
                    <Phone
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      placeholder="+92 300 1234567"
                      value={form.phone}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          phone: e.target.value,
                        })
                      }
                      className="
                        w-full
                        pl-10 pr-3 py-2.5
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


              {/* Company */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Company
                </label>

                <div className="relative">
                  <Building2
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    placeholder="Company name"
                    value={form.company}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        company: e.target.value,
                      })
                    }
                    className="
                      w-full
                      pl-10 pr-3 py-2.5
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


              {/* Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Customer Type
                </label>

                <div className="grid grid-cols-2 gap-3">

                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        type: 'individual',
                      })
                    }
                    className={`
                      flex items-center gap-3
                      p-3
                      rounded-xl
                      border
                      text-left
                      transition
                      ${
                        form.type === 'individual'
                          ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-500/10'
                          : 'border-slate-200 hover:bg-slate-50'
                      }
                    `}
                  >
                    <div className={`
                      h-9 w-9 rounded-lg flex items-center justify-center
                      ${
                        form.type === 'individual'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-slate-100 text-slate-500'
                      }
                    `}>
                      <User size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Individual
                      </p>

                      <p className="text-xs text-slate-400">
                        Personal customer
                      </p>
                    </div>

                  </button>


                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        type: 'business',
                      })
                    }
                    className={`
                      flex items-center gap-3
                      p-3
                      rounded-xl
                      border
                      text-left
                      transition
                      ${
                        form.type === 'business'
                          ? 'border-violet-500 bg-violet-50 ring-2 ring-violet-500/10'
                          : 'border-slate-200 hover:bg-slate-50'
                      }
                    `}
                  >
                    <div className={`
                      h-9 w-9 rounded-lg flex items-center justify-center
                      ${
                        form.type === 'business'
                          ? 'bg-violet-100 text-violet-600'
                          : 'bg-slate-100 text-slate-500'
                      }
                    `}>
                      <BriefcaseBusiness size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        Business
                      </p>

                      <p className="text-xs text-slate-400">
                        Company customer
                      </p>
                    </div>

                  </button>

                </div>

              </div>


              {/* Actions */}
              <div className="
                flex gap-3
                pt-4
                border-t border-slate-100
              ">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="
                    flex-1
                    py-2.5
                    rounded-xl
                    border border-slate-200
                    text-sm font-semibold
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
                    text-sm font-semibold
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
                  {editId ? 'Update Customer' : 'Save Customer'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}