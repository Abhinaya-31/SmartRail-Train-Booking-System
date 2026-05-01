const Train = require('../database/models/Train');

// @desc    Search for trains based on source, destination and date
// @route   GET /api/trains/search?source=...&destination=...&date=...
// @access  Public
const searchTrains = async (req, res) => {
  const { source, destination, date } = req.query;

  // Step 1: Validate query parameters
  if (!source || !destination || !date) {
    return res.status(400).json({ message: 'Please provide source, destination, and travel date for the search' });
  }

  try {
    // Step 2: Determine the day of the week from the provided date
    // Our Train model stores running days as short strings (e.g., "Mon", "Tue")
    const searchDate = new Date(date);
    const dayOfWeek = searchDate.toLocaleDateString('en-US', { weekday: 'short' });

    // Step 3: Query the database for matching trains
    // We use regular expressions for source and destination to allow case-insensitive, partial matches
    const matchingTrains = await Train.find({
      source: { $regex: new RegExp(source, 'i') },
      destination: { $regex: new RegExp(destination, 'i') },
      runningDays: dayOfWeek,
    });

    // Step 4: Return the results to the client
    res.json(matchingTrains);
  } catch (error) {
    console.error('Error occurred while searching for trains:', error.message);
    res.status(500).json({ message: 'Failed to search trains. Please try again later.' });
  }
};

// GET /api/trains/:id
const getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) {
      return res.status(404).json({ message: 'Train not found' });
    }
    res.json(train);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching train details' });
  }
};

// GET /api/trains - list all trains (admin use)
const getAllTrains = async (req, res) => {
  try {
    const trains = await Train.find().sort({ createdAt: -1 });
    res.json(trains);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch trains' });
  }
};

module.exports = { searchTrains, getTrainById, getAllTrains };
