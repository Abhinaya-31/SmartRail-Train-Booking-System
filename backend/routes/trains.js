const express = require('express');
const router = express.Router();
const { searchTrains, getTrainById, getAllTrains } = require('../controllers/trainController');
const { protect } = require('../middleware/authMiddleware');

router.get('/search', protect, searchTrains);
router.get('/', protect, getAllTrains);
router.get('/:id', protect, getTrainById);

module.exports = router;
