const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Get inventory overview
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).select('sku name category stock minStock price costPrice');
    
    const lowStock = products.filter(p => p.stock <= p.minStock);
    const outOfStock = products.filter(p => p.stock === 0);
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);

    res.json({
      success: true,
      data: {
        products,
        summary: {
          totalItems: products.length,
          lowStockCount: lowStock.length,
          outOfStockCount: outOfStock.length,
          inventoryValue: totalValue
        },
        lowStock,
        outOfStock
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
