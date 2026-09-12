const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Employee = require('../models/Employee');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

dotenv.config({ path: require('path').join(__dirname, '../.env') });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await Promise.all([
      User.deleteMany(),
      Employee.deleteMany(),
      Product.deleteMany(),
      Customer.deleteMany()
    ]);

    // Admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@erp.com',
      password: 'admin123',
      role: 'admin',
      department: 'IT'
    });

    await User.create({
      name: 'Manager User',
      email: 'manager@erp.com',
      password: 'manager123',
      role: 'manager',
      department: 'Sales'
    });

    // Employees
    await Employee.insertMany([
      {
        employeeId: 'EMP0001',
        firstName: 'Ali',
        lastName: 'Khan',
        email: 'ali.khan@company.com',
        phone: '+92-300-1234567',
        department: 'IT',
        position: 'Senior Developer',
        salary: 150000,
        status: 'active'
      },
      {
        employeeId: 'EMP0002',
        firstName: 'Sara',
        lastName: 'Ahmed',
        email: 'sara.ahmed@company.com',
        phone: '+92-301-2345678',
        department: 'HR',
        position: 'HR Manager',
        salary: 120000,
        status: 'active'
      },
      {
        employeeId: 'EMP0003',
        firstName: 'Hassan',
        lastName: 'Raza',
        email: 'hassan.raza@company.com',
        department: 'Sales',
        position: 'Sales Executive',
        salary: 80000,
        status: 'active'
      },
      {
        employeeId: 'EMP0004',
        firstName: 'Fatima',
        lastName: 'Malik',
        email: 'fatima.malik@company.com',
        department: 'Finance',
        position: 'Accountant',
        salary: 95000,
        status: 'active'
      }
    ]);

    // Products
    await Product.insertMany([
      {
        sku: 'PRD-001',
        name: 'Laptop Dell XPS 15',
        description: 'High performance laptop',
        category: 'Electronics',
        price: 250000,
        costPrice: 200000,
        stock: 25,
        minStock: 5,
        unit: 'pcs'
      },
      {
        sku: 'PRD-002',
        name: 'Office Chair Ergonomic',
        category: 'Furniture',
        price: 18000,
        costPrice: 12000,
        stock: 40,
        minStock: 10
      },
      {
        sku: 'PRD-003',
        name: 'Wireless Mouse Logitech',
        category: 'Electronics',
        price: 3500,
        costPrice: 2200,
        stock: 8,
        minStock: 15
      },
      {
        sku: 'PRD-004',
        name: 'A4 Paper Ream',
        category: 'Stationery',
        price: 800,
        costPrice: 550,
        stock: 120,
        minStock: 30
      },
      {
        sku: 'PRD-005',
        name: 'Standing Desk',
        category: 'Furniture',
        price: 45000,
        costPrice: 32000,
        stock: 12,
        minStock: 5
      }
    ]);

    // Customers
    await Customer.insertMany([
      {
        customerCode: 'CUS0001',
        name: 'Tech Solutions Ltd',
        email: 'contact@techsolutions.com',
        phone: '+92-21-1234567',
        company: 'Tech Solutions Ltd',
        type: 'business',
        status: 'active'
      },
      {
        customerCode: 'CUS0002',
        name: 'Ahmed Retail',
        email: 'ahmed@retail.com',
        phone: '+92-300-9876543',
        type: 'individual',
        status: 'active'
      },
      {
        customerCode: 'CUS0003',
        name: 'Global Traders',
        email: 'info@globaltraders.pk',
        company: 'Global Traders',
        type: 'business',
        status: 'active'
      }
    ]);

    console.log('✅ Seed data created successfully!');
    console.log('Login credentials:');
    console.log('  Admin  → admin@erp.com / admin123');
    console.log('  Manager → manager@erp.com / manager123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
