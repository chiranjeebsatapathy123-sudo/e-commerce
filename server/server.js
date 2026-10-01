const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const morgan = require('morgan');
const sequelize = require('./config/db');
const { helmetMiddleware, corsMiddleware, generalLimiter } = require('./middleware/security');
const { formatResponse } = require('./middleware/responseFormatter');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for dev
    methods: ["GET", "POST"]
  }
});

// Expose io to routes if needed
app.set('io', io);

// Basic socket logic
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Real-time activity broadcast
  socket.on('activity', (data) => {
    // broadcast to everyone except sender
    socket.broadcast.emit('live_activity', data); 
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(generalLimiter);

// Custom morgan format for structured logging
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(express.json({ limit: '10kb' }));
app.use(formatResponse);

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const aiRoutes = require('./routes/aiRoutes');
const searchRoutes = require('./routes/searchRoutes');
const commerceBrainRoutes = require('./routes/commerceBrainRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/commerce-brain', commerceBrainRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'E-Commerce API is running smoothly' });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    error: {
      code: statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_ERROR',
      message: err.message,
      details: process.env.NODE_ENV === 'production' ? null : err.stack
    }
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    // Start Autonomous Marketing Engine
    const CartAbandonmentWorker = require('./services/intelligence/cartAbandonmentWorker');
    CartAbandonmentWorker.start(60);
    
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync();
      console.log('Database synchronized (development mode).');
    } else {
      console.log('Database synchronization skipped. Ensure migrations are run.');
    }
    
    server.listen(PORT, () => {
      console.log(`Server is running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

if (process.env.VERCEL !== '1') {
  startServer();
}

module.exports = app;
