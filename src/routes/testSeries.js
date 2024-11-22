const express = require('express');
const { Op } = require('sequelize');
const { TestSeries, TestTile } = require('../models');
const { isAuthenticated, isResourceOwner } = require('../middleware/auth');
const router = express.Router();

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Get all test series for the current user
router.get('/', async (req, res, next) => {
  try {
    const series = await TestSeries.findAll({
      where: { userId: req.user.id },
      order: [['dateCreated', 'DESC']]
    });
    res.json(series);
  } catch (error) {
    next(error);
  }
});

// Search test series
router.get('/search', async (req, res, next) => {
  try {
    const { query, status } = req.query;
    const where = {
      userId: req.user.id,
      [Op.or]: [
        { name: { [Op.iLike]: `%${query}%` } },
        { description: { [Op.iLike]: `%${query}%` } },
        { goal: { [Op.iLike]: `%${query}%` } }
      ]
    };

    if (status) {
      where.status = status;
    }

    const series = await TestSeries.findAll({
      where,
      order: [['dateCreated', 'DESC']]
    });

    res.json(series);
  } catch (error) {
    next(error);
  }
});

// Get a single test series with its tiles
router.get('/:id', isResourceOwner(TestSeries), async (req, res, next) => {
  try {
    const series = req.resource;
    const tiles = await TestTile.findAll({
      where: { seriesId: series.id },
      order: [['dateCreated', 'DESC']]
    });
    res.json({
      ...series.toJSON(),
      tiles
    });
  } catch (error) {
    next(error);
  }
});

// Create a new test series
router.post('/', async (req, res, next) => {
  try {
    const series = await TestSeries.create({
      ...req.body,
      userId: req.user.id
    });
    res.status(201).json(series);
  } catch (error) {
    next(error);
  }
});

// Update a test series
router.put('/:id', isResourceOwner(TestSeries), async (req, res, next) => {
  try {
    const series = req.resource;
    await series.update(req.body);
    res.json(series);
  } catch (error) {
    next(error);
  }
});

// Delete a test series
router.delete('/:id', isResourceOwner(TestSeries), async (req, res, next) => {
  try {
    await req.resource.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

// Get test series by status
router.get('/status/:status', async (req, res, next) => {
  try {
    const { status } = req.params;
    const series = await TestSeries.findAll({
      where: {
        userId: req.user.id,
        status
      },
      order: [['dateCreated', 'DESC']]
    });
    res.json(series);
  } catch (error) {
    next(error);
  }
});

// Add a test tile to a series
router.post('/:id/tiles', isResourceOwner(TestSeries), async (req, res, next) => {
  try {
    const { tileId } = req.body;
    const tile = await TestTile.findOne({
      where: {
        id: tileId,
        userId: req.user.id
      }
    });

    if (!tile) {
      return res.status(404).json({ error: 'Test tile not found' });
    }

    await tile.update({ seriesId: req.resource.id });
    res.json(tile);
  } catch (error) {
    next(error);
  }
});

// Remove a test tile from a series
router.delete('/:id/tiles/:tileId', isResourceOwner(TestSeries), async (req, res, next) => {
  try {
    const tile = await TestTile.findOne({
      where: {
        id: req.params.tileId,
        userId: req.user.id,
        seriesId: req.resource.id
      }
    });

    if (!tile) {
      return res.status(404).json({ error: 'Test tile not found in series' });
    }

    await tile.update({ seriesId: null });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
