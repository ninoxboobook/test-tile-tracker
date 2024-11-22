const express = require('express');
const { Op } = require('sequelize');
const { Decoration } = require('../models');
const { isAuthenticated, isResourceOwner } = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Get all decorations for the current user
router.get('/', async (req, res, next) => {
  try {
    const decorations = await Decoration.findAll({
      where: { userId: req.user.id },
      order: [['name', 'ASC']]
    });
    res.json(decorations);
  } catch (error) {
    next(error);
  }
});

// Search decorations
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

    const decorations = await Decoration.findAll({
      where,
      order: [['name', 'ASC']]
    });

    res.json(decorations);
  } catch (error) {
    next(error);
  }
});

// Get a single decoration
router.get('/:id', isResourceOwner(Decoration), (req, res) => {
  res.json(req.resource);
});

// Create a new decoration
router.post('/', async (req, res, next) => {
  try {
    const decoration = await Decoration.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(decoration);
  } catch (error) {
    next(error);
  }
});

// Update a decoration
router.put('/:id', isResourceOwner(Decoration), async (req, res, next) => {
  try {
    const decoration = req.resource;
    await decoration.update(req.body);
    res.json(decoration);
  } catch (error) {
    next(error);
  }
});

// Delete a decoration
router.delete('/:id', isResourceOwner(Decoration), async (req, res, next) => {
  try {
    await req.resource.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Get decorations by type
router.get('/type/:type', async (req, res, next) => {
  try {
    const { type } = req.params;
    const decorations = await Decoration.findAll({
      where: {
        userId: req.user.id,
        type
      },
      order: [['name', 'ASC']]
    });
    res.json(decorations);
  } catch (error) {
    next(error);
  }
});

// Get decorations by manufacturer
router.get('/manufacturer/:manufacturer', async (req, res, next) => {
  try {
    const { manufacturer } = req.params;
    const decorations = await Decoration.findAll({
      where: {
        userId: req.user.id,
        manufacturer: {
          [Op.iLike]: `%${manufacturer}%`
        }
      },
      order: [['name', 'ASC']]
    });
    res.json(decorations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
