const express = require('express');
const { Op } = require('sequelize');
const { ClayBody } = require('../models');
const { isAuthenticated, isResourceOwner } = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Get all clay bodies for the current user
router.get('/', async (req, res, next) => {
  try {
    console.log('Fetching clay bodies for user:', req.user.id);
    const clayBodies = await ClayBody.findAll({
      where: { userId: req.user.id },
      order: [['name', 'ASC']]
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

// Display form to create a new clay body
router.get('/new', async (req, res, next) => {
  try {
    res.render('clay-bodies/new', {
      title: 'New Clay Body - Test Tile Tracker',
      user: req.user,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
});

// Search clay bodies
router.get('/search', async (req, res, next) => {
  try {
    const { query, type } = req.query;
    const where = {
      userId: req.user.id,
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } }
      ]
    };

    if (type) {
      where.type = type;
    }

    const clayBodies = await ClayBody.findAll({
      where,
      order: [['name', 'ASC']]
    });

    res.json(clayBodies);
  } catch (error) {
    next(error);
  }
});

// Get a single clay body
router.get('/:id', isResourceOwner(ClayBody), async (req, res, next) => {
  try {
    const clayBody = await ClayBody.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!clayBody) {
      req.flash('error', 'Clay body not found');
      return res.redirect('/clay-bodies');
    }

    res.render('clay-bodies/show', {
      title: `${clayBody.name} - Test Tile Tracker`,
      user: req.user,
      clayBody,
      messages: req.flash()
    });
  } catch (error) {
    next(error);
  }
});

// Create a new clay body
router.post('/', async (req, res, next) => {
  try {
    // Convert numeric strings to numbers
    const numericFields = ['firingTemperature', 'shrinkage', 'absorption'];
    numericFields.forEach(field => {
      if (req.body[field]) {
        req.body[field] = parseFloat(req.body[field]);
      }
    });

    console.log('Creating clay body with data:', req.body);

    const clayBody = await ClayBody.create({
      ...req.body,
      userId: req.user.id
    });

    req.flash('success', 'Clay body created successfully!');
    res.redirect(`/clay-bodies/${clayBody.id}`);
  } catch (error) {
    console.error('Error creating clay body:', error);
    req.flash('error', `Error creating clay body: ${error.message}`);
    res.redirect('/clay-bodies/new');
  }
});

// Update a clay body
router.put('/:id', isResourceOwner(ClayBody), async (req, res, next) => {
  try {
    const clayBody = await ClayBody.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!clayBody) {
      return res.status(404).json({ error: 'Clay body not found' });
    }

    // Parse the composition JSON if it exists
    if (req.body.composition) {
      try {
        req.body.composition = JSON.parse(req.body.composition);
      } catch (e) {
        return res.status(400).json({ error: 'Invalid composition format' });
      }
    }

    await clayBody.update(req.body);
    res.json(clayBody);
  } catch (error) {
    next(error);
  }
});

// Delete a clay body
router.delete('/:id', isResourceOwner(ClayBody), async (req, res, next) => {
  try {
    await req.resource.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Get clay bodies by type
router.get('/type/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const clayBodies = await ClayBody.findAll({
      where: {
        userId: req.user.id,
        type
      },
      order: [['name', 'ASC']]
    });
    res.json(clayBodies);
  } catch (error) {
    next(error);
  }
});

// Get clay bodies by firing temperature range
router.get('/temperature-range', async (req, res, next) => {
  try {
    const { min, max } = req.query;
    const clayBodies = await ClayBody.findAll({
      where: {
        userId: req.user.id,
        firingTemperature: {
          [Op.between]: [min, max]
        }
      },
      order: [['name', 'ASC']]
    });
    res.json(clayBodies);
  } catch (error) {
    next(error);
  }
});

// Get clay bodies by cone
router.get('/cone/:cone', async (req, res, next) => {
  try {
    const { cone } = req.params;
    const clayBodies = await ClayBody.findAll({
      where: {
        userId: req.user.id,
        cone
      },
      order: [['name', 'ASC']]
    });
    res.json(clayBodies);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
