const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking, getBookingByPNR } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Public route for PNR status check
router.get('/pnr/:pnr', getBookingByPNR);

module.exports = router;
