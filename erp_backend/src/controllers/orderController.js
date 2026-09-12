const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

exports.getAll = async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;
    let query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const orders = await Order.find(query)
      .populate('customer', 'name email company customerCode')
      .populate('items.product', 'name sku')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer')
      .populate('items.product')
      .populate('createdBy', 'name email');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { customer, items, tax = 0, discount = 0, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item' });
    }

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const total = product.price * item.quantity;
      subtotal += total;
      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        unitPrice: product.price,
        total
      });

      // Deduct stock
      product.stock -= item.quantity;
      await product.save();
    }

    const totalAmount = subtotal + tax - discount;
    const count = await Order.countDocuments();
    const orderNumber = `ORD${String(count + 1).padStart(5, '0')}`;

    const order = await Order.create({
      orderNumber,
      customer,
      items: orderItems,
      subtotal,
      tax,
      discount,
      totalAmount,
      paymentMethod,
      notes,
      createdBy: req.user._id
    });

    // Update customer stats
    await Customer.findByIdAndUpdate(customer, {
      $inc: { totalOrders: 1, totalSpent: totalAmount }
    });

    const populated = await Order.findById(order._id)
      .populate('customer', 'name email')
      .populate('items.product', 'name sku');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const update = {};
    if (status) update.status = status;
    if (paymentStatus) update.paymentStatus = paymentStatus;

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true })
      .populate('customer', 'name')
      .populate('items.product', 'name');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
