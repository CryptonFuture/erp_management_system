
import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Users,
  UserPlus,
  Building2,
  X,
  Mail,
  Phone,
  BriefcaseBusiness,
  WalletCards,
  ChevronDown,
} from 'lucide-react'

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'IT',
    position: '',
    salary: '',
  })

  const [editId, setEditId] = useState(null)

  const fetchData = async () => {
    try {
      const { data } = await api.get('/employees', {
        params: { search },
      })

      setEmployees(data.data)
    } catch (err) {
      toast.error('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [search])

  const resetForm = () => {
    setForm({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: 'IT',
      position: '',
      salary: '',
    })
    setEditId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (editId) {
        await api.put(`/employees/${editId}`, form)
        toast.success('Employee updated')
      } else {
        await api.post('/employees', form)
        toast.success('Employee created')
      }

      setShowModal(false)
      resetForm()
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    }
  }

  const handleEdit = (emp) => {
    setForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      email: emp.email,
      phone: emp.phone || '',
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
    })

    setEditId(emp._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this employee?')) return

    try {
      await api.delete(`/employees/${id}`)
      toast.success('Deleted')
      fetchData()
    } catch (err) {
      toast.error('Delete failed')
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`
      .toUpperCase()
  }

  const activeEmployees = employees.filter(
    emp => emp.status === 'active'
  ).length

  const departments = new Set(
    employees.map(emp => emp.department)
  ).size

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users size={17} className="text-blue-600" />

            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Human Resources
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Employees
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage your employees, departments and workforce.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="group inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold text-sm shadow-lg shadow-blue-600/20 transition-all duration-200"
        >
          <Plus
            size={18}
            className="group-hover:rotate-90 transition-transform duration-200"
          />

          Add Employee
        </button>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Users size={21} className="text-blue-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">
                Total Employees
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {employees.length}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <UserPlus size={21} className="text-emerald-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">
                Active Employees
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {activeEmployees}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
              <Building2 size={21} className="text-violet-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">
                Departments
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {departments}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* =====================================================
          SEARCH BAR
      ===================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">

        <div className="relative max-w-xl">

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search by employee name, email or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
          />

          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg hover:bg-slate-200 flex items-center justify-center text-slate-400"
            >
              <X size={15} />
            </button>
          )}

        </div>
      </div>

      {/* =====================================================
          TABLE
      ===================================================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        {/* Table Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

          <div>
            <h3 className="font-semibold text-slate-900">
              Employee Directory
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              {employees.length} employee{employees.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-500">
              Live Data
            </span>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">

                <th className="text-left px-6 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">
                  Employee
                </th>

                <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">
                  Department
                </th>

                <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">
                  Position
                </th>

                <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">
                  Salary
                </th>

                <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">
                  Status
                </th>

                <th className="text-right px-6 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td colSpan="6" className="py-16">

                    <div className="flex flex-col items-center justify-center">

                      <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />

                      <p className="text-sm text-slate-500 mt-4">
                        Loading employees...
                      </p>

                    </div>

                  </td>
                </tr>
              ) : employees.length === 0 ? (

                <tr>
                  <td colSpan="6" className="py-16">

                    <div className="text-center">

                      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center">
                        <Users
                          size={25}
                          className="text-slate-300"
                        />
                      </div>

                      <p className="text-sm font-semibold text-slate-600 mt-4">
                        No employees found
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Try changing your search or add a new employee.
                      </p>

                    </div>

                  </td>
                </tr>

              ) : (

                employees.map((emp) => (

                  <tr
                    key={emp._id}
                    className="group hover:bg-slate-50/80 transition-colors"
                  >

                    {/* Employee */}
                    <td className="px-6 py-4">

                      <div className="flex items-center gap-3">

                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          {getInitials(
                            emp.firstName,
                            emp.lastName
                          )}
                        </div>

                        <div className="min-w-0">

                          <p className="font-semibold text-slate-800 truncate">
                            {emp.firstName} {emp.lastName}
                          </p>

                          <div className="flex items-center gap-1.5 mt-1">
                            <Mail
                              size={11}
                              className="text-slate-400"
                            />

                            <p className="text-xs text-slate-400 truncate">
                              {emp.email}
                            </p>
                          </div>

                          <p className="text-[10px] font-mono text-slate-400 mt-1">
                            ID: {emp.employeeId}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Department */}
                    <td className="px-4 py-4">

                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                        <Building2 size={12} />
                        {emp.department}
                      </span>

                    </td>

                    {/* Position */}
                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2 text-slate-600">
                        <BriefcaseBusiness
                          size={15}
                          className="text-slate-400"
                        />

                        <span className="text-sm">
                          {emp.position}
                        </span>
                      </div>

                    </td>

                    {/* Salary */}
                    <td className="px-4 py-4">

                      <div className="flex items-center gap-2">

                        <WalletCards
                          size={15}
                          className="text-emerald-500"
                        />

                        <span className="font-semibold text-slate-700">
                          Rs {emp.salary?.toLocaleString()}
                        </span>

                      </div>

                    </td>

                    {/* Status */}
                    <td className="px-4 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          emp.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200'
                        }`}
                      >

                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            emp.status === 'active'
                              ? 'bg-emerald-500'
                              : 'bg-slate-400'
                          }`}
                        />

                        {emp.status}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">

                      <div className="flex justify-end items-center gap-1">

                        <button
                          onClick={() => handleEdit(emp)}
                          title="Edit employee"
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(emp._id)}
                          title="Delete employee"
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* =====================================================
          MODAL
      ===================================================== */}
      {showModal && (

        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">

          <div
            className="absolute inset-0"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  {editId ? (
                    <Pencil
                      size={18}
                      className="text-blue-600"
                    />
                  ) : (
                    <UserPlus
                      size={19}
                      className="text-blue-600"
                    />
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-slate-900">
                    {editId ? 'Edit Employee' : 'Add Employee'}
                  </h2>

                  <p className="text-xs text-slate-400 mt-0.5">
                    {editId
                      ? 'Update employee information'
                      : 'Create a new employee record'}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition"
              >
                <X size={18} />
              </button>

            </div>

            {/* Modal Body */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    First Name
                  </label>

                  <input
                    placeholder="John"
                    value={form.firstName}
                    onChange={e =>
                      setForm({
                        ...form,
                        firstName: e.target.value,
                      })
                    }
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Last Name
                  </label>

                  <input
                    placeholder="Doe"
                    value={form.lastName}
                    onChange={e =>
                      setForm({
                        ...form,
                        lastName: e.target.value,
                      })
                    }
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                    required
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={e =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Phone
                </label>

                <div className="relative">
                  <Phone
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    placeholder="+92 300 1234567"
                    value={form.phone}
                    onChange={e =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                    className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Department
                  </label>

                  <div className="relative">

                    <select
                      value={form.department}
                      onChange={e =>
                        setForm({
                          ...form,
                          department: e.target.value,
                        })
                      }
                      className="appearance-none w-full h-11 px-3.5 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                    >
                      {[
                        'HR',
                        'Finance',
                        'Sales',
                        'IT',
                        'Operations',
                        'Marketing',
                        'Production',
                      ].map(d => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>

                    <ChevronDown
                      size={16}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />

                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Position
                  </label>

                  <input
                    placeholder="Software Engineer"
                    value={form.position}
                    onChange={e =>
                      setForm({
                        ...form,
                        position: e.target.value,
                      })
                    }
                    className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                    required
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Salary
                </label>

                <div className="relative">
                  <WalletCards
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="number"
                    placeholder="100000"
                    value={form.salary}
                    onChange={e =>
                      setForm({
                        ...form,
                        salary: e.target.value,
                      })
                    }
                    className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                    required
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-3">

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-semibold text-sm transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm shadow-lg shadow-blue-600/20 transition"
                >
                  {editId ? 'Update Employee' : 'Create Employee'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}

