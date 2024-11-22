const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class TestTile extends Model {}

TestTile.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  testSeriesId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'TestSeries',
      key: 'id'
    }
  },
  clayBodyId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'ClayBodies',
      key: 'id'
    }
  },
  decorationId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Decorations',
      key: 'id'
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  firingTemperature: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firingSchedule: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of {temperature: number, holdTime: number, rampRate: number}'
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  results: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Object containing test results and observations'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  sequelize,
  modelName: 'TestTile',
  tableName: 'TestTiles',
  timestamps: true
});

module.exports = TestTile;
