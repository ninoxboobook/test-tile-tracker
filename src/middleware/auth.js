const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

const isResourceOwner = (Model) => async (req, res, next) => {
  try {
    const resourceId = req.params.id;
    const resource = await Model.findByPk(resourceId);

    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    if (resource.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.resource = resource;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isAuthenticated,
  isResourceOwner
};
