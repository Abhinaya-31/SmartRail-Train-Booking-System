const jwt = require('jsonwebtoken');
const User = require('../database/models/User');

// Helper function to generate JWT token for authenticated users
const generateToken = (userId) => {
  // We sign the token with the user ID and our secret key, expiring in 7 days
  const secret = process.env.JWT_SECRET || 'supersecret123';
  return jwt.sign({ id: userId }, secret, { expiresIn: '7d' });
};

// @desc    Register a new user account
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  // Step 1: Validate input - make sure all required fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please provide name, email, and password' });
  }

  try {
    // Step 2: Check if a user with this email already exists in our database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'This email is already registered. Try logging in.' });
    }

    // Step 3: Create the new user. The password hashing is handled by the Mongoose pre-save hook in the User model.
    const newUser = await User.create({
      name,
      email,
      password,
    });

    // Step 4: Return success response along with a token so the user can be logged in immediately
    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      token: generateToken(newUser._id),
    });
  } catch (error) {
    // Log the error for debugging purposes
    console.error('Registration failed:', error.message);
    res.status(500).json({ message: 'Something went wrong during registration. Please try again later.' });
  }
};

// @desc    Authenticate a user and get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Step 1: Validate input
  if (!email || !password) {
    return res.status(400).json({ message: 'Both email and password are required' });
  }

  try {
    // Step 2: Find the user by their email address
    const targetUser = await User.findOne({ email });
    
    // If we can't find a user, return an unauthorized error
    if (!targetUser) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your email or password.' });
    }

    // Step 3: Check if the provided password matches the hashed password in the database
    const doesPasswordMatch = await targetUser.matchPassword(password);
    if (!doesPasswordMatch) {
      return res.status(401).json({ message: 'Invalid credentials. Please check your email or password.' });
    }

    // Step 4: If credentials are valid, generate and return the JWT token
    res.json({
      _id: targetUser._id,
      name: targetUser.name,
      email: targetUser.email,
      role: targetUser.role,
      token: generateToken(targetUser._id),
    });
  } catch (error) {
    console.error('Login process encountered an error:', error.message);
    res.status(500).json({ message: `Internal server error during login: ${error.message}` });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json(req.user);
};

// @desc    Update user profile (Name or Password)
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update name if provided
      user.name = req.body.name || user.name;
      
      // Update password if provided
      if (req.body.password) {
        user.password = req.body.password;
        // The pre-save hook in User model will automatically hash this new password
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        token: generateToken(updatedUser._id), // Refresh token
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile update error:', error.message);
    res.status(500).json({ message: 'Failed to update profile' });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };
