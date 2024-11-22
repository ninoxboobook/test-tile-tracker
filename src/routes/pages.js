const express = require('express');
const router = express.Router();
const { TestTile, TestSeries, ClayBody, Decoration, User } = require('../models');

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/login');
};

// Home page
router.get('/', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      console.log('Fetching dashboard data for user:', req.user.id);
      
      // Get counts for dashboard
      const [testTileCount, clayBodyCount, decorationCount, testSeriesCount] = await Promise.all([
        TestTile.count({ where: { userId: req.user.id } }),
        ClayBody.count({ where: { userId: req.user.id } }),
        Decoration.count({ where: { userId: req.user.id } }),
        TestSeries.count({ where: { userId: req.user.id } })
      ]);
      
      console.log('Found dashboard data:', testTileCount, clayBodyCount, decorationCount, testSeriesCount);
      
      res.render('dashboard', {
        title: 'Dashboard - Test Tile Tracker',
        user: req.user,
        counts: {
          testTiles: testTileCount,
          clayBodies: clayBodyCount,
          decorations: decorationCount,
          testSeries: testSeriesCount
        }
      });
    } else {
      console.log('Rendering landing page');
      res.render('index', {
        title: 'Test Tile Tracker - Home',
        user: null
      });
    }
  } catch (error) {
    console.error('Home Page Error:', error.message);
    console.error('Error stack:', error.stack);
    req.flash('error', `Error loading home page: ${error.message}`);
    res.redirect('/login');
  }
});

// Login page
router.get('/login', (req, res) => {
  try {
    console.log('Rendering login page');
    if (req.user) {
      return res.redirect('/dashboard');
    }
    res.render('auth/login', {
      title: 'Login - Test Tile Tracker',
      user: null
    });
  } catch (error) {
    console.error('Login Page Error:', error.message);
    console.error('Error stack:', error.stack);
    req.flash('error', `Error loading login page: ${error.message}`);
    res.redirect('/');
  }
});

// Register page
router.get('/register', (req, res) => {
  try {
    console.log('Rendering register page');
    if (req.user) {
      return res.redirect('/dashboard');
    }
    res.render('auth/register', {
      title: 'Register - Test Tile Tracker',
      user: null
    });
  } catch (error) {
    console.error('Register Page Error:', error.message);
    console.error('Error stack:', error.stack);
    req.flash('error', `Error loading register page: ${error.message}`);
    res.redirect('/');
  }
});

// Dashboard page (protected route)
router.get('/dashboard', isAuthenticated, async (req, res) => {
  try {
    console.log('Fetching dashboard data for user:', req.user.id);
    const [testTileCount, testSeriesCount, clayBodiesCount, decorationsCount] = await Promise.all([
      TestTile.count({ where: { userId: req.user.id } }),
      TestSeries.count({ where: { userId: req.user.id } }),
      ClayBody.count({ where: { userId: req.user.id } }),
      Decoration.count({ where: { userId: req.user.id } })
    ]);
    console.log('Found dashboard data:', testTileCount, testSeriesCount, clayBodiesCount, decorationsCount);

    res.render('dashboard', {
      title: 'Dashboard - Test Tile Tracker',
      user: req.user,
      stats: {
        testTiles: testTileCount,
        testSeries: testSeriesCount,
        clayBodies: clayBodiesCount,
        decorations: decorationsCount
      }
    });
  } catch (error) {
    console.error('Dashboard Error:', error.message);
    console.error('Error stack:', error.stack);
    req.flash('error', `Error loading dashboard: ${error.message}`);
    res.redirect('/');
  }
});

// Test Tiles page (protected)
router.get('/test-tiles', isAuthenticated, async (req, res, next) => {
  try {
    console.log('Fetching test tiles for user:', req.user.id);
    const testTiles = await TestTile.findAll({
      where: { userId: req.user.id },
      include: [
        { 
          model: TestSeries,
          attributes: ['id', 'name']
        },
        { 
          model: ClayBody,
          attributes: ['id', 'name', 'type']
        },
        { 
          model: Decoration,
          attributes: ['id', 'name', 'type']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    console.log('Found test tiles:', testTiles.length);

    res.render('test-tiles/index', {
      title: 'Test Tiles - Test Tile Tracker',
      user: req.user,
      testTiles,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
});

// Test Series page (protected)
router.get('/test-series', isAuthenticated, async (req, res, next) => {
  try {
    console.log('Fetching test series for user:', req.user.id);
    const series = await TestSeries.findAll({
      where: { userId: req.user.id },
      include: [
        { 
          model: TestTile,
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    console.log('Found test series:', series.length);

    res.render('test-series/index', {
      title: 'Test Series - Test Tile Tracker',
      user: req.user,
      series,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
});

// Clay Bodies page (protected)
router.get('/clay-bodies', isAuthenticated, async (req, res, next) => {
  try {
    console.log('Fetching clay bodies for user:', req.user.id);
    const clayBodies = await ClayBody.findAll({
      where: { userId: req.user.id },
      include: [
        { 
          model: TestTile,
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    console.log('Found clay bodies:', clayBodies.length);

    res.render('clay-bodies/index', {
      title: 'Clay Bodies - Test Tile Tracker',
      user: req.user,
      clayBodies,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
});

// Decorations page (protected)
router.get('/decorations', isAuthenticated, async (req, res, next) => {
  try {
    console.log('Fetching decorations for user:', req.user.id);
    const decorations = await Decoration.findAll({
      where: { userId: req.user.id },
      include: [
        { 
          model: TestTile,
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    console.log('Found decorations:', decorations.length);

    res.render('decorations/index', {
      title: 'Decorations - Test Tile Tracker',
      user: req.user,
      decorations,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
});

// New Decoration form (protected)
router.get('/decorations/new', isAuthenticated, (req, res) => {
  try {
    console.log('Rendering new decoration form');
    res.render('decorations/new', {
      title: 'New Decoration - Test Tile Tracker',
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    console.error('New Decoration Form Error:', error);
    req.flash('error', 'Error loading new decoration form');
    res.redirect('/decorations');
  }
});

// Create new decoration (protected)
router.post('/decorations', isAuthenticated, async (req, res) => {
  try {
    console.log('Creating new decoration for user:', req.user.id);
    const decorationData = {
      ...req.body,
      userId: req.user.id
    };
    
    const decoration = await Decoration.create(decorationData);
    console.log('Created decoration:', decoration.id);
    
    req.flash('success', 'Decoration created successfully');
    res.redirect('/decorations');
  } catch (error) {
    console.error('Create Decoration Error:', error);
    req.flash('error', 'Error creating decoration');
    res.redirect('/decorations/new');
  }
});

// Profile page (protected)
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    console.log('Fetching profile data for user:', req.user.id);
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });
    console.log('Found profile data:', user);

    res.render('profile/index', {
      title: 'Profile - Test Tile Tracker',
      user: user
    });
  } catch (error) {
    console.error('Profile Error:', error.message);
    console.error('Error stack:', error.stack);
    req.flash('error', `Error loading profile: ${error.message}`);
    res.redirect('/dashboard');
  }
});

module.exports = router;
