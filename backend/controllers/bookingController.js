const Booking = require('../database/models/Booking');
const Train = require('../database/models/Train');

// Helper function: Generate a PNR like PNR1234567890
// We use the current timestamp plus a random number to avoid collisions
const generatePNR = () => {
  const timestampPart = Date.now().toString().slice(-7);
  const randomPart = Math.floor(Math.random() * 900 + 100);
  return `PNR${timestampPart}${randomPart}`;
};

// @desc    Create a new train booking
// @route   POST /api/bookings
// @access  Private (Logged in users only)
const createBooking = async (req, res) => {
  const { trainId, journeyDate, seatsBooked, passengerName, passengerAge, passengerGender } = req.body;

  // Step 1: Basic validation for required fields
  if (!trainId || !journeyDate || !seatsBooked || !passengerName || !passengerAge || !passengerGender) {
    return res.status(400).json({ message: 'Missing required booking details (including age and gender)' });
  }

  // Step 2: Ensure the user doesn't book an unreasonable number of seats
  if (seatsBooked < 1 || seatsBooked > 6) {
    return res.status(400).json({ message: 'Seat booking limit is between 1 and 6 seats per transaction' });
  }

  try {
    // Step 3: Fetch the train to check availability and calculate fare
    const selectedTrain = await Train.findById(trainId);
    
    if (!selectedTrain) {
      return res.status(404).json({ message: 'Selected train could not be found in our records' });
    }

    // Check if enough seats are left
    if (selectedTrain.availableSeats < seatsBooked) {
      return res.status(400).json({
        message: `Booking failed. Only ${selectedTrain.availableSeats} seats are currently available.`,
      });
    }

    // Step 4: Deduct the booked seats from the train's available capacity
    selectedTrain.availableSeats -= seatsBooked;
    await selectedTrain.save();

    // Step 5: Calculate total fare (including 5% tax) and create the booking record
    const baseFare = seatsBooked * selectedTrain.fare;
    const taxAmount = Math.round(baseFare * 0.05); // 5% tax
    const totalFareCalculated = baseFare + taxAmount;
    
    const newBooking = await Booking.create({
      pnr: generatePNR(),
      user: req.user._id, // Coming from auth middleware
      train: trainId,
      journeyDate,
      seatsBooked,
      totalFare: totalFareCalculated,
      passengerName,
      passengerAge,
      passengerGender,
    });

    // Step 6: Populate the train details so the frontend can show a complete summary right away
    await newBooking.populate('train', 'trainName trainNumber source destination departureTime arrivalTime fare');

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Failed to create booking:', error.message);
    res.status(500).json({ message: 'An internal error occurred while processing your booking' });
  }
};

// GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('train', 'trainName trainNumber source destination departureTime arrivalTime')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// @desc    Cancel an existing booking and restore seats
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Logged in users only)
const cancelBooking = async (req, res) => {
  try {
    // Step 1: Find the booking by ID
    const targetBooking = await Booking.findById(req.params.id);

    if (!targetBooking) {
      return res.status(404).json({ message: 'Booking record not found' });
    }

    // Step 2: Security check - ensure the user cancelling is the owner of the booking
    if (targetBooking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not authorized to cancel this booking' });
    }

    // Step 3: Prevent duplicate cancellations
    if (targetBooking.status === 'cancelled') {
      return res.status(400).json({ message: 'This booking has already been cancelled' });
    }

    // Step 4: Restore the cancelled seats back to the Train's available capacity
    const linkedTrain = await Train.findById(targetBooking.train);
    if (linkedTrain) {
      linkedTrain.availableSeats += targetBooking.seatsBooked;
      await linkedTrain.save();
    }

    // Step 5: Mark the booking as cancelled
    targetBooking.status = 'cancelled';
    await targetBooking.save();

    res.json({ message: 'Booking cancelled successfully. Seats have been restored.', booking: targetBooking });
  } catch (error) {
    console.error('Cancellation process failed:', error.message);
    res.status(500).json({ message: 'An error occurred while attempting to cancel the booking' });
  }
};

// @desc    Get booking details by PNR (Public or Protected, depends on preference)
// @route   GET /api/bookings/pnr/:pnr
// @access  Public
const getBookingByPNR = async (req, res) => {
  try {
    const normalizedPnr = req.params.pnr?.trim().toUpperCase();

    if (!normalizedPnr) {
      return res.status(400).json({ message: 'PNR is required' });
    }
    
    // Find the booking and populate train details
    const booking = await Booking.findOne({ pnr: normalizedPnr })
      .populate('train', 'trainName trainNumber source destination departureTime arrivalTime fare');

    if (!booking) {
      return res.status(404).json({ message: 'No booking found with this PNR number' });
    }

    // We can return the booking. Since it's public, maybe we limit what we return, but for this app it's fine.
    res.json(booking);
  } catch (error) {
    console.error('PNR fetch error:', error.message);
    res.status(500).json({ message: 'Failed to fetch PNR status' });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getBookingByPNR };
