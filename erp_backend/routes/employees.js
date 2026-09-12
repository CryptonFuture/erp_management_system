const express = require('express');
const router = express.Router();
const {
  getAll,
  getOne,
  create,
  update,
  remove
} = require('../controllers/employeeController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getAll)
  .post(authorize('admin', 'manager'), create);

router.route('/:id')
  .get(getOne)
  .put(authorize('admin', 'manager'), update)
  .delete(authorize('admin'), remove);

module.exports = router;
