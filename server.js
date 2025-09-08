const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

// Load env ASAP and from explicit path
dotenv.config({ path: path.join(__dirname, '.env') });

const { connectDatabase } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health route for quick checks
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api', require('./routes/leads'));
app.use('/api/dashboard', require('./routes/dashboard'));

// 404 handler for unknown routes
app.use((req, res) => {
  return res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

// Start server after DB connection
const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'test') {
  connectDatabase()
    .then(() => {
      app.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Failed to connect to DB', err);
      process.exit(1);
    });
}

module.exports = app;

