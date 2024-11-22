const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class TestSeries extends Model {}

TestSeries.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  variables: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of variables being tested in this series'
  },
  goal: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('planned', 'in-progress', 'completed', 'archived'),
    allowNull: false,
    defaultValue: 'planned'
  },
  conclusions: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'TestSeries',
  tableName: 'TestSeries'
});

module.exports = TestSeries;
