const mongoose = require('mongoose');

const trainSchema = new mongoose.Schema(
  {
    trainNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    trainName: {
      type: String,
      required: true,
      trim: true,
    },
    trainType: {
      type: String,
      default: 'Express',
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: String,
      required: true, // e.g. "06:30"
    },
    arrivalTime: {
      type: String,
      required: true, // e.g. "14:45"
    },
    totalSeats: {
      type: Number,
      required: true,
    },
    availableSeats: {
      type: Number,
      required: true,
    },
    fare: {
      type: Number,
      required: true, // fare per seat in INR
    },
    // Days this train runs
    runningDays: {
      type: [String],
      default: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Train', trainSchema);
