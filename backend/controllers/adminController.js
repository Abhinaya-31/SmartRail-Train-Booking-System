const Train = require('../database/models/Train');
const Booking = require('../database/models/Booking');

// @desc    Add a new train to the database
// @route   POST /api/admin/trains
// @access  Private (Admin only)
const addTrain = async (req, res) => {
  const {
    trainNumber,
    trainName,
    trainType,
    source,
    destination,
    departureTime,
    arrivalTime,
    totalSeats,
    fare,
    runningDays,
  } = req.body;

  // Step 1: Validate that all required fields are present
  if (!trainNumber || !trainName || !source || !destination || !departureTime || !arrivalTime || !totalSeats || !fare) {
    return res.status(400).json({ message: 'All train fields are mandatory for adding a new train' });
  }

  try {
    // Step 2: Ensure we don't add duplicate trains
    const existingTrain = await Train.findOne({ trainNumber });
    if (existingTrain) {
      return res.status(400).json({ message: `Train number ${trainNumber} already exists in the system` });
    }

    // Step 3: Create the new train record
    // We set availableSeats equal to totalSeats initially because no bookings exist yet
    const newTrain = await Train.create({
      trainNumber,
      trainName,
      trainType: trainType || 'Express',
      source,
      destination,
      departureTime,
      arrivalTime,
      totalSeats,
      availableSeats: totalSeats,
      fare,
      runningDays: runningDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    });

    res.status(201).json(newTrain);
  } catch (error) {
    console.error('Add train error:', error.message);
    res.status(500).json({ message: 'Server error: Failed to add train' });
  }
};

// GET /api/admin/bookings — view all bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate('train', 'trainName trainNumber source destination')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// DELETE /api/admin/trains/:id
const deleteTrain = async (req, res) => {
  try {
    const train = await Train.findByIdAndDelete(req.params.id);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }
    res.json({ message: 'Train deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete train' });
  }
};

module.exports = { addTrain, getAllBookings, deleteTrain };
