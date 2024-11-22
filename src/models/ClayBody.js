const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

class ClayBody extends Model {}

ClayBody.init({
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
  type: {
    type: DataTypes.ENUM('Raku', 'Earthenware', 'Stoneware', 'Bone China', 'Porcelain', 'Wild'),
    allowNull: false
  },
  manufacturer: {
    type: DataTypes.STRING,
    allowNull: true
  },
  firingTemperature: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  cone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  colourOxidation: {
    type: DataTypes.STRING,
    allowNull: true
  },
  colourReduction: {
    type: DataTypes.STRING,
    allowNull: true
  },
  shrinkage: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  absorption: {
    type: DataTypes.FLOAT,
    allowNull: true
  },
  plasticity: {
    type: DataTypes.STRING,
    allowNull: true
  },
  texture: {
    type: DataTypes.STRING,
    allowNull: true
  },
  composition: {
    type: DataTypes.TEXT,
    allowNull: true
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
  modelName: 'ClayBody',
  tableName: 'clay_bodies',
  timestamps: true
});

module.exports = ClayBody;
