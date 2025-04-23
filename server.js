require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use('/orders', orderRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Restaurant POS Backend API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

// Export the app for Firebase Functions
module.exports = app;

// If running locally, start the server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
