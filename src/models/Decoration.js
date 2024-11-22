const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class Decoration extends Model {}

Decoration.init({
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
  type: {
    type: DataTypes.STRING,
    allowNull: true
  },
  category: {
    type: DataTypes.ENUM('commercial', 'studio', 'formula'),
    allowNull: false,
    defaultValue: 'studio'
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  recipe: {
    type: DataTypes.JSONB,
    allowNull: true,
    comment: 'Array of {material: string, percentage: number}'
  },
  glazyUrl: {
    type: DataTypes.STRING,
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
  applicationMethod: {
    type: DataTypes.STRING,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING,
    allowNull: true
  },
  surface: {
    type: DataTypes.STRING,
    allowNull: true
  },
  transparency: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Decoration',
  tableName: 'Decorations',
  indexes: [
    {
      fields: ['userId', 'name'],
      unique: true
    },
    {
      fields: ['userId', 'type']
    }
  ]
});

module.exports = Decoration;
