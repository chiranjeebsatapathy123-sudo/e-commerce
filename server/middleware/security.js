const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

// Rate limiting configurations
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  message: 'Too many authentication attempts, please try again after an hour.',
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = {
  helmetMiddleware: helmet(),
  generalLimiter,
  authLimiter,
  corsMiddleware: cors(corsOptions),
};
