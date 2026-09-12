import { useEffect, useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import {
  AlertTriangle,
  Package,
  DollarSign,
  Boxes,
  Tags,
  TrendingUp,
  Warehouse,
  CircleAlert,
} from 'lucide-react'

export default function Inventory() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/inventory')
      .then(res => setData(res.data.data))
      .catch(() => toast.error('Failed to load inventory'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="
          h-10 w-10
          rounded-full
          border-4 border-slate-200
          border-t-blue-600
          animate-spin
        " />

        <p className="mt-4 text-sm text-slate-500">
          Loading inventory...
        </p>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="
          h-14 w-14
          rounded-2xl
          bg-red-50
          flex items-center justify-center
        ">
          <CircleAlert
            size={26}
            className="text-red-500"
          />
        </div>

        <h3 className="mt-4 font-semibold text-slate-700">
          Failed to load inventory
        </h3>

        <p className="text-sm text-slate-400 mt-1">
          Please try again later.
        </p>
      </div>
    )
  }

  const { summary, products, lowStock } = data

  const totalUnits = products.reduce(
    (sum, p) => sum + (p.stock || 0),
    0
  )

  const categories = new Set(
    products.map(p => p.category).filter(Boolean)
  ).size

  return (
    <div className="space-y-6">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="
        flex flex-col
        lg:flex-row
        lg:items-center
        lg:justify-between
        gap-4
      ">

        <div>
          <div className="flex items-center gap-2 mb-1">

            <div className="
              h-8 w-1
              rounded-full
              bg-gradient-to-b
              from-blue-600
              to-indigo-600
            " />

            <span className="
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-blue-600
            ">
              Inventory Management
            </span>

          </div>

          <h1 className="
            text-2xl
            font-bold
            text-slate-800
          ">
            Inventory
          </h1>

          <p className="
            text-sm
            text-slate-500
            mt-1
          ">
            Monitor stock levels, inventory value and product availability
          </p>
        </div>

        <div className="
          inline-flex
          items-center
          gap-2
          px-3.5 py-2
          rounded-xl
          bg-emerald-50
          border border-emerald-100
          text-emerald-700
          text-xs
          font-semibold
          self-start
          lg:self-auto
        ">
          <span className="
            h-2
            w-2
            rounded-full
            bg-emerald-500
          " />

          Inventory System Active
        </div>

      </div>


      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-4
      ">

        {/* Total SKUs */}
        <div className="
          relative
          overflow-hidden
          bg-white
          rounded-2xl
          border border-slate-200
          p-5
          shadow-sm
          hover:shadow-md
          transition-shadow
        ">

          <div className="
            absolute
            top-0
            left-0
            right-0
            h-1
            bg-gradient-to-r
            from-blue-500
            to-indigo-500
          " />

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>
              <p className="
                text-sm
                font-medium
                text-slate-500
              ">
                Total SKUs
              </p>

              <h3 className="
                text-2xl
                font-bold
                text-slate-800
                mt-1
              ">
                {summary.totalItems}
              </h3>

              <p className="
                text-xs
                text-slate-400
                mt-1
              ">
                Products in inventory
              </p>
            </div>

            <div className="
              h-11 w-11
              rounded-xl
              bg-blue-50
              flex items-center justify-center
            ">
              <Package
                size={22}
                className="text-blue-600"
              />
            </div>

          </div>
        </div>


        {/* Low Stock */}
        <div className="
          relative
          overflow-hidden
          bg-white
          rounded-2xl
          border border-slate-200
          p-5
          shadow-sm
          hover:shadow-md
          transition-shadow
        ">

          <div className="
            absolute
            top-0
            left-0
            right-0
            h-1
            bg-gradient-to-r
            from-red-500
            to-orange-500
          " />

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>
              <p className="
                text-sm
                font-medium
                text-slate-500
              ">
                Low Stock
              </p>

              <h3 className="
                text-2xl
                font-bold
                text-slate-800
                mt-1
              ">
                {summary.lowStockCount}
              </h3>

              <p className="
                text-xs
                text-slate-400
                mt-1
              ">
                Products need attention
              </p>
            </div>

            <div className="
              h-11 w-11
              rounded-xl
              bg-red-50
              flex items-center justify-center
            ">
              <AlertTriangle
                size={22}
                className="text-red-600"
              />
            </div>

          </div>
        </div>


        {/* Inventory Value */}
        <div className="
          relative
          overflow-hidden
          bg-white
          rounded-2xl
          border border-slate-200
          p-5
          shadow-sm
          hover:shadow-md
          transition-shadow
        ">

          <div className="
            absolute
            top-0
            left-0
            right-0
            h-1
            bg-gradient-to-r
            from-emerald-500
            to-teal-500
          " />

          <div className="
            flex
            items-center
            justify-between
          ">

            <div className="min-w-0">

              <p className="
                text-sm
                font-medium
                text-slate-500
              ">
                Inventory Value
              </p>

              <h3 className="
                text-xl
                font-bold
                text-slate-800
                mt-1
                truncate
              ">
                Rs {(summary.inventoryValue || 0).toLocaleString()}
              </h3>

              <p className="
                text-xs
                text-slate-400
                mt-1
              ">
                Current stock valuation
              </p>

            </div>

            <div className="
              h-11 w-11
              rounded-xl
              bg-emerald-50
              flex items-center justify-center
              shrink-0
            ">
              <DollarSign
                size={22}
                className="text-emerald-600"
              />
            </div>

          </div>
        </div>


        {/* Total Units */}
        <div className="
          relative
          overflow-hidden
          bg-white
          rounded-2xl
          border border-slate-200
          p-5
          shadow-sm
          hover:shadow-md
          transition-shadow
        ">

          <div className="
            absolute
            top-0
            left-0
            right-0
            h-1
            bg-gradient-to-r
            from-violet-500
            to-purple-500
          " />

          <div className="
            flex
            items-center
            justify-between
          ">

            <div>

              <p className="
                text-sm
                font-medium
                text-slate-500
              ">
                Total Units
              </p>

              <h3 className="
                text-2xl
                font-bold
                text-slate-800
                mt-1
              ">
                {totalUnits.toLocaleString()}
              </h3>

              <p className="
                text-xs
                text-slate-400
                mt-1
              ">
                Across {categories} categories
              </p>

            </div>

            <div className="
              h-11 w-11
              rounded-xl
              bg-violet-50
              flex items-center justify-center
            ">
              <Boxes
                size={22}
                className="text-violet-600"
              />
            </div>

          </div>
        </div>

      </div>


      {/* =====================================================
          LOW STOCK ALERT
      ===================================================== */}
      {lowStock.length > 0 && (
        <div className="
          relative
          overflow-hidden
          bg-gradient-to-r
          from-red-50
          to-orange-50
          border
          border-red-100
          rounded-2xl
          shadow-sm
        ">

          {/* Accent */}
          <div className="
            absolute
            left-0
            top-0
            bottom-0
            w-1
            bg-gradient-to-b
            from-red-500
            to-orange-500
          " />

          <div className="p-5">

            <div className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
              mb-4
            ">

              <div className="
                flex
                items-center
                gap-3
              ">

                <div className="
                  h-10 w-10
                  rounded-xl
                  bg-red-100
                  flex
                  items-center
                  justify-center
                ">
                  <AlertTriangle
                    size={20}
                    className="text-red-600"
                  />
                </div>

                <div>
                  <h3 className="
                    font-bold
                    text-red-800
                  ">
                    Low Stock Alert
                  </h3>

                  <p className="
                    text-xs
                    text-red-600/70
                    mt-0.5
                  ">
                    These products are at or below their minimum stock level
                  </p>
                </div>

              </div>

              <span className="
                inline-flex
                items-center
                justify-center
                px-3 py-1.5
                rounded-lg
                bg-red-100
                text-red-700
                text-xs
                font-bold
              ">
                {lowStock.length} Items
              </span>

            </div>


            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
              gap-3
            ">

              {lowStock.map(p => {

                const stockPercentage = p.minStock > 0
                  ? Math.min(
                      100,
                      (p.stock / p.minStock) * 100
                    )
                  : 0

                return (
                  <div
                    key={p._id}
                    className="
                      bg-white/80
                      backdrop-blur-sm
                      border border-red-100
                      rounded-xl
                      p-4
                    "
                  >

                    <div className="
                      flex
                      items-center
                      justify-between
                      gap-3
                    ">

                      <div className="
                        flex
                        items-center
                        gap-3
                        min-w-0
                      ">

                        <div className="
                          h-9 w-9
                          shrink-0
                          rounded-lg
                          bg-red-50
                          flex
                          items-center
                          justify-center
                        ">
                          <Package
                            size={17}
                            className="text-red-500"
                          />
                        </div>

                        <div className="min-w-0">

                          <p className="
                            text-sm
                            font-semibold
                            text-slate-700
                            truncate
                          ">
                            {p.name}
                          </p>

                          <p className="
                            text-[11px]
                            text-slate-400
                            font-mono
                            mt-0.5
                          ">
                            {p.sku}
                          </p>

                        </div>

                      </div>

                      <div className="
                        text-right
                        shrink-0
                      ">
                        <p className="
                          text-sm
                          font-bold
                          text-red-600
                        ">
                          {p.stock}
                        </p>

                        <p className="
                          text-[10px]
                          text-slate-400
                        ">
                          / {p.minStock} min
                        </p>
                      </div>

                    </div>


                    {/* Progress */}
                    <div className="
                      mt-3
                      h-1.5
                      bg-red-100
                      rounded-full
                      overflow-hidden
                    ">
                      <div
                        className="
                          h-full
                          rounded-full
                          bg-gradient-to-r
                          from-red-500
                          to-orange-500
                        "
                        style={{
                          width: `${Math.max(
                            5,
                            stockPercentage
                          )}%`,
                        }}
                      />
                    </div>

                  </div>
                )
              })}

            </div>

          </div>
        </div>
      )}


      {/* =====================================================
          INVENTORY TABLE
      ===================================================== */}
      <div className="
        bg-white
        rounded-2xl
        border border-slate-200
        shadow-sm
        overflow-hidden
      ">

        {/* Table Header */}
        <div className="
          px-5 py-4
          border-b border-slate-100
          flex
          flex-col
          sm:flex-row
          sm:items-center
          sm:justify-between
          gap-3
        ">

          <div>
            <h2 className="
              font-semibold
              text-slate-800
            ">
              Inventory Overview
            </h2>

            <p className="
              text-xs
              text-slate-400
              mt-0.5
            ">
              Current stock and product valuation
            </p>
          </div>

          <div className="
            flex
            items-center
            gap-2
            text-xs
            text-slate-500
          ">
            <Warehouse
              size={15}
              className="text-slate-400"
            />

            {products.length} products
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
                  text-left
                  px-5 py-3.5
                  font-semibold
                  text-slate-500
                  text-xs
                  uppercase
                  tracking-wider
                ">
                  Product
                </th>

                <th className="
                  text-left
                  px-5 py-3.5
                  font-semibold
                  text-slate-500
                  text-xs
                  uppercase
                  tracking-wider
                ">
                  Category
                </th>

                <th className="
                  text-left
                  px-5 py-3.5
                  font-semibold
                  text-slate-500
                  text-xs
                  uppercase
                  tracking-wider
                ">
                  Stock Level
                </th>

                <th className="
                  text-left
                  px-5 py-3.5
                  font-semibold
                  text-slate-500
                  text-xs
                  uppercase
                  tracking-wider
                ">
                  Min Stock
                </th>

                <th className="
                  text-right
                  px-5 py-3.5
                  font-semibold
                  text-slate-500
                  text-xs
                  uppercase
                  tracking-wider
                ">
                  Inventory Value
                </th>

              </tr>
            </thead>


            <tbody className="
              divide-y
              divide-slate-100
            ">

              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="py-14 text-center"
                  >

                    <div className="
                      flex
                      flex-col
                      items-center
                    ">

                      <div className="
                        h-14 w-14
                        rounded-2xl
                        bg-slate-100
                        flex
                        items-center
                        justify-center
                      ">
                        <Package
                          size={26}
                          className="text-slate-400"
                        />
                      </div>

                      <h3 className="
                        mt-4
                        font-semibold
                        text-slate-700
                      ">
                        No inventory found
                      </h3>

                      <p className="
                        text-sm
                        text-slate-400
                        mt-1
                      ">
                        There are no products in inventory.
                      </p>

                    </div>

                  </td>
                </tr>
              ) : (
                products.map((p) => {

                  const isLowStock =
                    p.stock <= p.minStock

                  const stockPercentage =
                    p.minStock > 0
                      ? Math.min(
                          100,
                          (p.stock /
                            (p.minStock * 2)) *
                            100
                        )
                      : 100

                  const inventoryValue =
                    (p.stock || 0) *
                    (p.costPrice || 0)

                  return (
                    <tr
                      key={p._id}
                      className="
                        group
                        hover:bg-slate-50/80
                        transition-colors
                      "
                    >

                      {/* Product */}
                      <td className="px-5 py-4">

                        <div className="
                          flex
                          items-center
                          gap-3
                        ">

                          <div className={`
                            h-10 w-10
                            shrink-0
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            ${
                              isLowStock
                                ? 'bg-red-50'
                                : 'bg-blue-50'
                            }
                          `}>
                            <Package
                              size={18}
                              className={
                                isLowStock
                                  ? 'text-red-500'
                                  : 'text-blue-600'
                              }
                            />
                          </div>

                          <div className="min-w-0">

                            <p className="
                              font-semibold
                              text-slate-800
                              truncate
                            ">
                              {p.name}
                            </p>

                            <p className="
                              text-xs
                              text-slate-400
                              font-mono
                              mt-0.5
                            ">
                              {p.sku}
                            </p>

                          </div>

                        </div>

                      </td>


                      {/* Category */}
                      <td className="px-5 py-4">

                        <span className="
                          inline-flex
                          items-center
                          gap-1.5
                          px-2.5 py-1.5
                          rounded-lg
                          bg-slate-100
                          text-slate-600
                          text-xs
                          font-semibold
                        ">
                          <Tags size={13} />

                          {p.category || 'Uncategorized'}
                        </span>

                      </td>


                      {/* Stock */}
                      <td className="px-5 py-4">

                        <div className="min-w-[150px]">

                          <div className="
                            flex
                            items-center
                            justify-between
                            mb-1.5
                          ">

                            <div className="
                              flex
                              items-center
                              gap-2
                            ">

                              <span className={`
                                text-sm
                                font-bold
                                ${
                                  isLowStock
                                    ? 'text-red-600'
                                    : 'text-slate-700'
                                }
                              `}>
                                {p.stock}
                              </span>

                              {isLowStock && (
                                <span className="
                                  inline-flex
                                  items-center
                                  gap-1
                                  px-1.5 py-0.5
                                  rounded-md
                                  bg-red-50
                                  text-red-600
                                  text-[10px]
                                  font-bold
                                ">
                                  <AlertTriangle size={10} />
                                  LOW
                                </span>
                              )}

                            </div>

                            <span className="
                              text-[10px]
                              text-slate-400
                            ">
                              units
                            </span>

                          </div>


                          <div className="
                            h-1.5
                            w-full
                            bg-slate-100
                            rounded-full
                            overflow-hidden
                          ">
                            <div
                              className={`
                                h-full
                                rounded-full
                                ${
                                  isLowStock
                                    ? 'bg-gradient-to-r from-red-500 to-orange-500'
                                    : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                                }
                              `}
                              style={{
                                width: `${Math.max(
                                  5,
                                  stockPercentage
                                )}%`,
                              }}
                            />
                          </div>

                        </div>

                      </td>


                      {/* Minimum Stock */}
                      <td className="px-5 py-4">

                        <div className="
                          flex
                          items-center
                          gap-2
                        ">

                          <div className="
                            h-8 w-8
                            rounded-lg
                            bg-slate-100
                            flex
                            items-center
                            justify-center
                          ">
                            <TrendingUp
                              size={14}
                              className="text-slate-500"
                            />
                          </div>

                          <span className="
                            font-medium
                            text-slate-600
                          ">
                            {p.minStock}
                          </span>

                        </div>

                      </td>


                      {/* Value */}
                      <td className="
                        px-5 py-4
                        text-right
                      ">

                        <div className="
                          inline-flex
                          items-center
                          gap-2
                        ">

                          <div className="
                            h-8 w-8
                            rounded-lg
                            bg-emerald-50
                            flex
                            items-center
                            justify-center
                          ">
                            <DollarSign
                              size={15}
                              className="text-emerald-600"
                            />
                          </div>

                          <span className="
                            font-semibold
                            text-slate-700
                            whitespace-nowrap
                          ">
                            Rs {inventoryValue.toLocaleString()}
                          </span>

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

    </div>
  )
}