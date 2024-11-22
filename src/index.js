const express = require('express');
const session = require('express-session');
const passport = require('passport');
const pgSession = require('connect-pg-simple')(session);
const { Pool } = require('pg');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
require('dotenv').config();

// Import routes
const pageRoutes = require('./routes/pages');
const authRoutes = require('./routes/auth');
const decorationRoutes = require('./routes/decorations');
const clayBodyRoutes = require('./routes/clayBodies');
const testTileRoutes = require('./routes/testTiles');
const testSeriesRoutes = require('./routes/testSeries');

// Import database connection
const sequelize = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/main');
app.use(expressLayouts);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(session({
  store: new pgSession({
    pool,
    tableName: 'user_sessions'
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    secure: process.env.NODE_ENV === 'production'
  }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.messages = {
    success: req.flash('success'),
    error: req.flash('error')
  };
  next();
});

// Serve static files from the public directory
app.use('/static', express.static(path.join(__dirname, 'public')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/decorations', decorationRoutes);
app.use('/api/test-tiles', testTileRoutes);
app.use('/api/test-series', testSeriesRoutes);
app.use('/clay-bodies', clayBodyRoutes);

// Page Routes (should be last to handle all other routes)
app.use('/', pageRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  
  // Send error response based on request type
  if (req.xhr || req.path.startsWith('/api/')) {
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error'
    });
  } else {
    req.flash('error', err.message || 'Internal Server Error');
    res.redirect('/dashboard');
  }
});

// 404 handler
app.use((req, res) => {
  if (req.xhr || req.path.startsWith('/api/')) {
    res.status(404).json({
      error: 'Not Found'
    });
  } else {
    req.flash('error', 'Page not found');
    res.redirect('/dashboard');
  }
});

// Start server
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    await sequelize.sync();
    console.log('Database models synchronized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();
