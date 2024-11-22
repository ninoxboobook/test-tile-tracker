const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Drop existing tables and recreate them with correct column names
      await queryInterface.dropTable('TestTiles', { cascade: true });
      await queryInterface.dropTable('TestSeries', { cascade: true });
      await queryInterface.dropTable('ClayBodies', { cascade: true });
      await queryInterface.dropTable('Decorations', { cascade: true });

      // Create TestSeries table
      await queryInterface.createTable('TestSeries', {
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
          allowNull: true
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
      });

      // Create ClayBodies table
      await queryInterface.createTable('ClayBodies', {
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
          type: DataTypes.ENUM('commercial', 'studio', 'reclaim'),
          allowNull: false,
          defaultValue: 'studio'
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true
        },
        coneRange: {
          type: DataTypes.STRING,
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
      });

      // Create Decorations table
      await queryInterface.createTable('Decorations', {
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
      });

      // Create TestTiles table
      await queryInterface.createTable('TestTiles', {
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
        name: {
          type: DataTypes.STRING,
          allowNull: false
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
          allowNull: true
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
      });
    } catch (error) {
      console.error('Migration Error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.dropTable('TestTiles', { cascade: true });
      await queryInterface.dropTable('TestSeries', { cascade: true });
      await queryInterface.dropTable('ClayBodies', { cascade: true });
      await queryInterface.dropTable('Decorations', { cascade: true });
    } catch (error) {
      console.error('Migration Error:', error);
      throw error;
    }
  }
};
