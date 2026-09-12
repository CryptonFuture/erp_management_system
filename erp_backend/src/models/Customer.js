const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    customerCode: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    company: { type: String },
    type: {
      type: String,
      enum: ['individual', 'business'],
      default: 'individual'
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String
    },
    creditLimit: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);
