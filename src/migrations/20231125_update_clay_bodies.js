const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // First, drop the existing enum type
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_clay_bodies_type" CASCADE');

    // Create the new enum type
    await queryInterface.sequelize.query(`
      CREATE TYPE "enum_clay_bodies_type" AS ENUM (
        'Raku', 'Earthenware', 'Stoneware', 'Bone China', 'Porcelain', 'Wild'
      )
    `);

    // Update existing columns and add new ones
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Check for old columns to drop
      const columnsToCheck = ['description', 'color'];
      for (const column of columnsToCheck) {
        const [results] = await queryInterface.sequelize.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'clay_bodies' 
          AND column_name = '${column}'
        `);
        
        if (results.length > 0) {
          await queryInterface.removeColumn('clay_bodies', column, { transaction });
        }
      }

      // Add type column if it doesn't exist
      const [typeResults] = await queryInterface.sequelize.query(`
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name = 'clay_bodies' 
        AND column_name = 'type'
      `);
      
      if (typeResults.length === 0) {
        await queryInterface.addColumn('clay_bodies', 'type', {
          type: "enum_clay_bodies_type",
          allowNull: false,
          defaultValue: 'Stoneware'
        }, { transaction });
      } else {
        await queryInterface.changeColumn('clay_bodies', 'type', {
          type: "enum_clay_bodies_type",
          allowNull: false
        }, { transaction });
      }

      // Make cone non-nullable
      await queryInterface.changeColumn('clay_bodies', 'cone', {
        type: DataTypes.STRING,
        allowNull: false
      }, { transaction });

      // Update firing temperature to be optional
      await queryInterface.changeColumn('clay_bodies', 'firingTemperature', {
        type: DataTypes.INTEGER,
        allowNull: true
      }, { transaction });

      // Add new columns if they don't exist
      const newColumns = [
        {
          name: 'colourOxidation',
          type: DataTypes.STRING,
          allowNull: true
        },
        {
          name: 'colourReduction',
          type: DataTypes.STRING,
          allowNull: true
        },
        {
          name: 'composition',
          type: DataTypes.TEXT,
          allowNull: true
        }
      ];

      for (const column of newColumns) {
        const [results] = await queryInterface.sequelize.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'clay_bodies' 
          AND column_name = '${column.name}'
        `);
        
        if (results.length === 0) {
          await queryInterface.addColumn('clay_bodies', column.name, column, { transaction });
        }
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Remove new columns
      const columnsToRemove = ['colourOxidation', 'colourReduction'];
      for (const column of columnsToRemove) {
        const [results] = await queryInterface.sequelize.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'clay_bodies' 
          AND column_name = '${column}'
        `);
        
        if (results.length > 0) {
          await queryInterface.removeColumn('clay_bodies', column, { transaction });
        }
      }

      // Add back original columns
      const originalColumns = [
        {
          name: 'color',
          type: DataTypes.STRING,
          allowNull: true
        },
        {
          name: 'description',
          type: DataTypes.TEXT,
          allowNull: true
        }
      ];

      for (const column of originalColumns) {
        const [results] = await queryInterface.sequelize.query(`
          SELECT column_name 
          FROM information_schema.columns 
          WHERE table_name = 'clay_bodies' 
          AND column_name = '${column.name}'
        `);
        
        if (results.length === 0) {
          await queryInterface.addColumn('clay_bodies', column.name, column, { transaction });
        }
      }

      // Make cone nullable again
      await queryInterface.changeColumn('clay_bodies', 'cone', {
        type: DataTypes.STRING,
        allowNull: true
      }, { transaction });

      // Drop the new enum type
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_clay_bodies_type" CASCADE');

      // Create the original enum type
      await queryInterface.sequelize.query(`
        CREATE TYPE "enum_clay_bodies_type" AS ENUM (
          'commercial', 'studio', 'reclaim'
        )
      `);

      // Restore original type column
      await queryInterface.changeColumn('clay_bodies', 'type', {
        type: "enum_clay_bodies_type",
        allowNull: false
      }, { transaction });
    });
  }
};
