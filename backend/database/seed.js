/**
 * Seed script — run once to populate sample trains and an admin user
 * Usage: node seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Train = require('./models/Train');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/trainbooking';

const sampleTrains = [
  {
    trainNumber: '12301',
    trainName: 'Rajdhani Express',
    trainType: 'Rajdhani',
    source: 'Delhi',
    destination: 'Mumbai',
    departureTime: '16:00',
    arrivalTime: '08:35',
    totalSeats: 200,
    availableSeats: 200,
    fare: 1450,
    runningDays: ['Mon', 'Wed', 'Fri', 'Sun'],
  },
  {
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani',
    trainType: 'Rajdhani',
    source: 'Mumbai',
    destination: 'Delhi',
    departureTime: '17:00',
    arrivalTime: '09:55',
    totalSeats: 200,
    availableSeats: 200,
    fare: 1450,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    trainNumber: '12259',
    trainName: 'Sealdah Duronto',
    trainType: 'Duronto',
    source: 'Delhi',
    destination: 'Kolkata',
    departureTime: '20:05',
    arrivalTime: '12:25',
    totalSeats: 150,
    availableSeats: 150,
    fare: 1200,
    runningDays: ['Mon', 'Wed', 'Fri'],
  },
  {
    trainNumber: '12621',
    trainName: 'Tamil Nadu Express',
    trainType: 'Superfast',
    source: 'Delhi',
    destination: 'Chennai',
    departureTime: '22:30',
    arrivalTime: '07:40',
    totalSeats: 180,
    availableSeats: 180,
    fare: 1600,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    trainNumber: '12627',
    trainName: 'Karnataka Express',
    trainType: 'Superfast',
    source: 'Delhi',
    destination: 'Bangalore',
    departureTime: '21:20',
    arrivalTime: '05:30',
    totalSeats: 160,
    availableSeats: 160,
    fare: 1750,
    runningDays: ['Mon', 'Tue', 'Thu', 'Fri', 'Sat'],
  },
  {
    trainNumber: '12050',
    trainName: 'Gatimaan Express',
    trainType: 'Shatabdi',
    source: 'Delhi',
    destination: 'Agra',
    departureTime: '08:10',
    arrivalTime: '09:50',
    totalSeats: 100,
    availableSeats: 100,
    fare: 750,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  {
    trainNumber: '12002',
    trainName: 'Bhopal Shatabdi',
    trainType: 'Shatabdi',
    source: 'Delhi',
    destination: 'Bhopal',
    departureTime: '06:00',
    arrivalTime: '13:45',
    totalSeats: 120,
    availableSeats: 120,
    fare: 900,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  {
    trainNumber: '11057',
    trainName: 'Amritsar Express',
    trainType: 'Express',
    source: 'Mumbai',
    destination: 'Amritsar',
    departureTime: '19:35',
    arrivalTime: '15:55',
    totalSeats: 170,
    availableSeats: 170,
    fare: 1300,
    runningDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing
    await Train.deleteMany({});
    await User.deleteMany({ role: 'admin' });

    // Insert trains
    await Train.insertMany(sampleTrains);
    console.log(`✓ Inserted ${sampleTrains.length} sample trains`);

    // Create admin user
    // The pre-save hook in User model will automatically hash 'admin123'
    await User.create({
      name: 'Admin',
      email: 'admin@trainbook.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('✓ Admin user created — email: admin@trainbook.com, password: admin123');

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

seedDB();
