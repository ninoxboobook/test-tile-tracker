const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { User } = require('../models');
const router = express.Router();

// Configure passport local strategy
passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return done(null, false, { message: 'Invalid email or password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Email or username already exists'
      });
    }

    // Create new user
    const user = await User.create({
      email,
      username,
      password // Password will be hashed by model hooks
    });

    // Log in the user after registration
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        res.json({
          id: user.id,
          email: user.email,
          username: user.username,
          redirect: '/dashboard'
        });
      } else {
        res.redirect('/dashboard');
      }
    });
  } catch (error) {
    next(error);
  }
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(401).json({ error: info.message || 'Invalid credentials' });
      } else {
        req.flash('error', info.message || 'Invalid credentials');
        return res.redirect('/login');
      }
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.json({
          id: user.id,
          email: user.email,
          username: user.username,
          redirect: '/dashboard'
        });
      } else {
        return res.redirect('/dashboard');
      }
    });
  })(req, res, next);
});

// Logout
router.post('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(500).json({ error: 'Error logging out' });
      } else {
        req.flash('error', 'Error logging out');
        return res.redirect('/');
      }
    }
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
      res.json({ message: 'Logged out successfully', redirect: '/' });
    } else {
      res.redirect('/');
    }
  });
});

// Get current user
router.get('/me', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json({
    id: req.user.id,
    email: req.user.email,
    username: req.user.username
  });
});

module.exports = router;
