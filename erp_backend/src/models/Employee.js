const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    department: {
      type: String,
      enum: ['HR', 'Finance', 'Sales', 'IT', 'Operations', 'Marketing', 'Production'],
      required: true
    },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    joinDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['active', 'inactive', 'on_leave', 'terminated'],
      default: 'active'
    },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    address: {
      street: String,
      city: String,
      country: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Employee', employeeSchema);
