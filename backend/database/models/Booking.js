const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    pnr: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    train: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Train',
      required: true,
    },
    journeyDate: {
      type: String, // stored as "YYYY-MM-DD"
      required: true,
    },
    seatsBooked: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
    },
    totalFare: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
    passengerName: {
      type: String,
      required: true,
    },
    passengerAge: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },
    passengerGender: {
      type: String,
      required: true,
      enum: ['Male', 'Female', 'Other'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
