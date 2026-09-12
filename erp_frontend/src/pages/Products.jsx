
import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  Boxes,
  AlertTriangle,
  Tags,
  X,
  DollarSign,
  Hash,
  Layers3,
  ChevronDown,
} from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    sku: '',
    name: '',
    category: 'Electronics',
    price: '',
    costPrice: '',
    stock: '',
    minStock: 10,
  })

  const [editId, setEditId] = useState(null)

  const fetchData = async () => {
    try {
      const { data } = await api.get('/products', {
        params: { search },
      })

      setProducts(data.data)
    } catch {
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [search])

  const resetForm = () => {
    setForm({
      sku: '',
      name: '',
      category: 'Electronics',
      price: '',
      costPrice: '',
      stock: '',
      minStock: 10,
    })

    setEditId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const payload = {
        ...form,
        price: +form.price,
        costPrice: +form.costPrice,
        stock: +form.stock,
        minStock: +form.minStock,
      }

      if (editId) {
        await api.put(`/products/${editId}`, payload)
        toast.success('Product updated')
      } else {
        await api.post('/products', payload)
        toast.success('Product created')
      }

      setShowModal(false)
      resetForm()
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error')
    }
  }

  const handleEdit = (p) => {
    setForm({
      sku: p.sku,
      name: p.name,
      category: p.category,
      price: p.price,
      costPrice: p.costPrice,
      stock: p.stock,
      minStock: p.minStock,
    })

    setEditId(p._id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return

    try {
      await api.delete(`/products/${id}`)
      toast.success('Deleted')
      fetchData()
    } catch {
      toast.error('Delete failed')
    }
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  const totalStock = products.reduce(
    (sum, product) => sum + (Number(product.stock) || 0),
    0
  )

  const lowStockProducts = products.filter(
    product => product.stock <= product.minStock
  ).length

  const categories = new Set(
    products.map(product => product.category)
  ).size

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package size={17} className="text-blue-600" />

            <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
              Inventory Management
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Products
          </h1>

          <p className="text-sm text-slate-500 mt-1">
            Manage products, pricing and inventory levels.
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

          Add Product
        </button>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Total Products */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <Package size={21} className="text-blue-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">
                Total Products
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {products.length}
              </p>
            </div>

          </div>
        </div>

        {/* Total Stock */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Boxes size={21} className="text-emerald-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">
                Total Stock
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {totalStock.toLocaleString()}
              </p>
            </div>

          </div>
        </div>

        {/* Categories */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-violet-50 flex items-center justify-center">
              <Tags size={21} className="text-violet-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">
                Categories
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {categories}
              </p>
            </div>

          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={21} className="text-red-600" />
            </div>

            <div>
              <p className="text-xs text-slate-500 font-medium">
                Low Stock
              </p>

              <p className="text-2xl font-bold text-slate-900 mt-0.5">
                {lowStockProducts}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">

        <div className="relative max-w-xl">

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search by SKU, product name or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
          PRODUCT TABLE
      ===================================================== */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">

          <div>
            <h3 className="font-semibold text-slate-900">
              Product Inventory
            </h3>

            <p className="text-xs text-slate-400 mt-1">
              {products.length} product{products.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />

            <span className="text-xs font-medium text-slate-500">
              Inventory Live
            </span>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100">

                <th className="text-left px-6 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">
                  Product
                </th>

                <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">
                  Category
                </th>

                <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">
                  Selling Price
                </th>

                <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">
                  Cost Price
                </th>

                <th className="text-left px-4 py-3.5 font-semibold text-xs uppercase tracking-wide text-slate-500">
                  Stock
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
                        Loading products...
                      </p>

                    </div>

                  </td>
                </tr>

              ) : products.length === 0 ? (

                <tr>
                  <td colSpan="6" className="py-16">

                    <div className="text-center">

                      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center">
                        <Package
                          size={25}
                          className="text-slate-300"
                        />
                      </div>

                      <p className="text-sm font-semibold text-slate-600 mt-4">
                        No products found
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Try changing your search or add a new product.
                      </p>

                    </div>

                  </td>
                </tr>

              ) : (

                products.map((p) => {

                  const isLowStock = p.stock <= p.minStock

                  return (
                    <tr
                      key={p._id}
                      className="group hover:bg-slate-50/80 transition-colors"
                    >

                      {/* Product */}
                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          <div
                            className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
                              isLowStock
                                ? 'bg-red-50 text-red-600'
                                : 'bg-blue-50 text-blue-600'
                            }`}
                          >
                            <Package size={19} />
                          </div>

                          <div className="min-w-0">

                            <p className="font-semibold text-slate-800 truncate">
                              {p.name}
                            </p>

                            <div className="flex items-center gap-1.5 mt-1">

                              <Hash
                                size={11}
                                className="text-slate-400"
                              />

                              <p className="text-xs font-mono text-slate-400">
                                {p.sku}
                              </p>

                            </div>

                          </div>

                        </div>

                      </td>

                      {/* Category */}
                      <td className="px-4 py-4">

                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                          <Tags size={12} />
                          {p.category}
                        </span>

                      </td>

                      {/* Selling Price */}
                      <td className="px-4 py-4">

                        <div className="flex items-center gap-2">

                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                            <DollarSign
                              size={13}
                              className="text-blue-600"
                            />
                          </div>

                          <span className="font-semibold text-slate-700">
                            Rs {p.price?.toLocaleString()}
                          </span>

                        </div>

                      </td>

                      {/* Cost Price */}
                      <td className="px-4 py-4">

                        <span className="text-slate-500">
                          Rs {p.costPrice?.toLocaleString()}
                        </span>

                      </td>

                      {/* Stock */}
                      <td className="px-4 py-4">

                        <div className="min-w-[110px]">

                          <div className="flex items-center justify-between mb-1.5">

                            <span
                              className={`font-semibold text-sm ${
                                isLowStock
                                  ? 'text-red-600'
                                  : 'text-slate-700'
                              }`}
                            >
                              {p.stock}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              Min {p.minStock}
                            </span>

                          </div>

                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">

                            <div
                              className={`h-full rounded-full transition-all ${
                                isLowStock
                                  ? 'bg-red-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    5,
                                    (p.stock /
                                      Math.max(
                                        p.minStock * 2,
                                        1
                                      )) *
                                      100
                                  )
                                )}%`,
                              }}
                            />

                          </div>

                          {isLowStock && (
                            <div className="flex items-center gap-1 mt-1.5">
                              <AlertTriangle
                                size={11}
                                className="text-red-500"
                              />

                              <span className="text-[10px] font-medium text-red-500">
                                Low stock
                              </span>
                            </div>
                          )}

                        </div>

                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">

                        <div className="flex justify-end items-center gap-1">

                          <button
                            onClick={() => handleEdit(p)}
                            title="Edit product"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() => handleDelete(p._id)}
                            title="Delete product"
                            className="w-9 h-9 rounded-lg flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                })
              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
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
                    <Package
                      size={19}
                      className="text-blue-600"
                    />
                  )}
                </div>

                <div>

                  <h2 className="font-bold text-slate-900">
                    {editId ? 'Edit Product' : 'Add Product'}
                  </h2>

                  <p className="text-xs text-slate-400 mt-0.5">
                    {editId
                      ? 'Update product information'
                      : 'Create a new inventory item'}
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

            {/* Modal Form */}
            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-4"
            >

              {/* SKU */}
              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  SKU
                </label>

                <div className="relative">

                  <Hash
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    placeholder="PROD-001"
                    value={form.sku}
                    onChange={e =>
                      setForm({
                        ...form,
                        sku: e.target.value,
                      })
                    }
                    className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                    required
                    disabled={!!editId}
                  />

                </div>

                {editId && (
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    SKU cannot be changed while editing.
                  </p>
                )}

              </div>

              {/* Product Name */}
              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Product Name
                </label>

                <input
                  placeholder="Product name"
                  value={form.name}
                  onChange={e =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                  required
                />

              </div>

              {/* Category */}
              <div>

                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Category
                </label>

                <div className="relative">

                  <Layers3
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                  <select
                    value={form.category}
                    onChange={e =>
                      setForm({
                        ...form,
                        category: e.target.value,
                      })
                    }
                    className="appearance-none w-full h-11 pl-10 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                  >
                    {[
                      'Electronics',
                      'Furniture',
                      'Clothing',
                      'Food',
                      'Stationery',
                      'Other',
                    ].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />

                </div>

              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Selling Price
                  </label>

                  <div className="relative">

                    <DollarSign
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      placeholder="0"
                      value={form.price}
                      onChange={e =>
                        setForm({
                          ...form,
                          price: e.target.value,
                        })
                      }
                      className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                      required
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Cost Price
                  </label>

                  <div className="relative">

                    <DollarSign
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      placeholder="0"
                      value={form.costPrice}
                      onChange={e =>
                        setForm({
                          ...form,
                          costPrice: e.target.value,
                        })
                      }
                      className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                      required
                    />

                  </div>

                </div>

              </div>

              {/* Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Current Stock
                  </label>

                  <div className="relative">

                    <Boxes
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      placeholder="0"
                      value={form.stock}
                      onChange={e =>
                        setForm({
                          ...form,
                          stock: e.target.value,
                        })
                      }
                      className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                      required
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    Minimum Stock
                  </label>

                  <div className="relative">

                    <AlertTriangle
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="number"
                      placeholder="10"
                      value={form.minStock}
                      onChange={e =>
                        setForm({
                          ...form,
                          minStock: e.target.value,
                        })
                      }
                      className="w-full h-11 pl-10 pr-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition"
                    />

                  </div>

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
                  {editId ? 'Update Product' : 'Create Product'}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  )
}

