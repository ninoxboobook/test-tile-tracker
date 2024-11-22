const User = require('./User');
const ClayBody = require('./ClayBody');
const Decoration = require('./Decoration');
const TestTile = require('./TestTile');
const TestSeries = require('./TestSeries');

// User associations
User.hasMany(TestTile, { foreignKey: 'userId' });
User.hasMany(TestSeries, { foreignKey: 'userId' });
User.hasMany(ClayBody, { foreignKey: 'userId' });
User.hasMany(Decoration, { foreignKey: 'userId' });

// TestTile associations
TestTile.belongsTo(User, { foreignKey: 'userId' });
TestTile.belongsTo(TestSeries, { foreignKey: 'testSeriesId' });
TestTile.belongsTo(ClayBody, { foreignKey: 'clayBodyId' });
TestTile.belongsTo(Decoration, { foreignKey: 'decorationId' });

// TestSeries associations
TestSeries.belongsTo(User, { foreignKey: 'userId' });
TestSeries.hasMany(TestTile, { foreignKey: 'testSeriesId' });

// ClayBody associations
ClayBody.belongsTo(User, { foreignKey: 'userId' });
ClayBody.hasMany(TestTile, { foreignKey: 'clayBodyId' });

// Decoration associations
Decoration.belongsTo(User, { foreignKey: 'userId' });
Decoration.hasMany(TestTile, { foreignKey: 'decorationId' });

module.exports = {
  User,
  ClayBody,
  Decoration,
  TestTile,
  TestSeries
};
