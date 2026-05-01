const express = require('express');
const router = express.Router();
const { addTrain, getAllBookings, deleteTrain } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/trains', protect, adminOnly, addTrain);
router.get('/bookings', protect, adminOnly, getAllBookings);
router.delete('/trains/:id', protect, adminOnly, deleteTrain);

module.exports = router;
