const express = require('express');
const router = express.Router();
const {
  getAll,
  getOne,
  create,
  updateStatus,
  remove
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAll)
  .post(authorize('admin', 'manager', 'employee'), create);

router.route('/:id')
  .get(getOne)
  .delete(authorize('admin'), remove);

router.patch('/:id/status', authorize('admin', 'manager'), updateStatus);

module.exports = router;
