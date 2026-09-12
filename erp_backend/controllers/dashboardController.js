const Employee = require('../models/Employee');
const Product = require('../models/Product');
const Customer = require('../models/Customer');
const Order = require('../models/Order');
const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const [
      totalEmployees,
      activeEmployees,
      totalProducts,
      lowStockProducts,
      totalCustomers,
      totalOrders,
      pendingOrders,
      revenueData
    ] = await Promise.all([
      Employee.countDocuments(),
      Employee.countDocuments({ status: 'active' }),
      Product.countDocuments({ isActive: true }),
      Product.countDocuments({ $expr: { $lte: ['$stock', '$minStock'] } }),
      Customer.countDocuments({ status: 'active' }),
      Order.countDocuments(),
      Order.countDocuments({ status: 'pending' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ])
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate('customer', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    // Department wise employees
    const deptStats = await Employee.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Monthly sales (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo }, paymentStatus: 'paid' } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          totalEmployees,
          activeEmployees,
          totalProducts,
          lowStockProducts,
          totalCustomers,
          totalOrders,
          pendingOrders,
          totalRevenue
        },
        recentOrders,
        deptStats,
        monthlySales
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
