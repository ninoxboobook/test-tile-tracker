const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TestTiles', { cascade: true });
    await queryInterface.dropTable('TestSeries', { cascade: true });
    await queryInterface.dropTable('ClayBodies', { cascade: true });
    await queryInterface.dropTable('Decorations', { cascade: true });

    // Create ENUM types
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_ClayBodies_type" AS ENUM ('commercial', 'studio', 'reclaim');
        EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_Decorations_category" AS ENUM ('commercial', 'studio', 'formula');
        EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_TestSeries_status" AS ENUM ('planned', 'in-progress', 'completed', 'archived');
        EXCEPTION WHEN duplicate_object THEN null;
      END $$;
    `);

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
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
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
      manufacturer: {
        type: DataTypes.STRING,
        allowNull: true
      },
      composition: {
        type: DataTypes.JSONB,
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
      color: {
        type: DataTypes.STRING,
        allowNull: true
      },
      shrinkage: {
        type: DataTypes.FLOAT,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
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
        allowNull: true
      },
      glazyUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      firingTemperature: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
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
        references: {
          model: 'TestSeries',
          key: 'id'
        }
      },
      clayBodyId: {
        type: DataTypes.UUID,
        references: {
          model: 'ClayBodies',
          key: 'id'
        }
      },
      decorationId: {
        type: DataTypes.UUID,
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
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('TestTiles');
    await queryInterface.dropTable('TestSeries');
    await queryInterface.dropTable('ClayBodies');
    await queryInterface.dropTable('Decorations');
    
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ClayBodies_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Decorations_category";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TestSeries_status";');
  }
};
