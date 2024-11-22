const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add missing fields to Decoration table
      await queryInterface.addColumn('Decorations', 'category', {
        type: DataTypes.ENUM('commercial', 'studio', 'formula'),
        allowNull: false,
        defaultValue: 'studio'
      });
      await queryInterface.addColumn('Decorations', 'manufacturer', {
        type: DataTypes.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('Decorations', 'recipe', {
        type: DataTypes.JSONB,
        allowNull: true
      });
      await queryInterface.addColumn('Decorations', 'glazyUrl', {
        type: DataTypes.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('Decorations', 'firingTemperature', {
        type: DataTypes.STRING,
        allowNull: true
      });

      // Add missing fields to ClayBody table
      await queryInterface.addColumn('ClayBodies', 'manufacturer', {
        type: DataTypes.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('ClayBodies', 'composition', {
        type: DataTypes.JSONB,
        allowNull: true
      });
      await queryInterface.addColumn('ClayBodies', 'firingTemperature', {
        type: DataTypes.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('ClayBodies', 'cone', {
        type: DataTypes.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('ClayBodies', 'color', {
        type: DataTypes.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('ClayBodies', 'shrinkage', {
        type: DataTypes.FLOAT,
        allowNull: true
      });

      // Add missing fields to TestSeries table
      await queryInterface.addColumn('TestSeries', 'variables', {
        type: DataTypes.JSONB,
        allowNull: true
      });
      await queryInterface.addColumn('TestSeries', 'goal', {
        type: DataTypes.TEXT,
        allowNull: true
      });
      await queryInterface.addColumn('TestSeries', 'status', {
        type: DataTypes.ENUM('planned', 'in-progress', 'completed', 'archived'),
        allowNull: false,
        defaultValue: 'planned'
      });
      await queryInterface.addColumn('TestSeries', 'conclusions', {
        type: DataTypes.TEXT,
        allowNull: true
      });

    } catch (error) {
      console.error('Migration Error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove columns from Decoration table
      await queryInterface.removeColumn('Decorations', 'category');
      await queryInterface.removeColumn('Decorations', 'manufacturer');
      await queryInterface.removeColumn('Decorations', 'recipe');
      await queryInterface.removeColumn('Decorations', 'glazyUrl');
      await queryInterface.removeColumn('Decorations', 'firingTemperature');

      // Remove columns from ClayBody table
      await queryInterface.removeColumn('ClayBodies', 'manufacturer');
      await queryInterface.removeColumn('ClayBodies', 'composition');
      await queryInterface.removeColumn('ClayBodies', 'firingTemperature');
      await queryInterface.removeColumn('ClayBodies', 'cone');
      await queryInterface.removeColumn('ClayBodies', 'color');
      await queryInterface.removeColumn('ClayBodies', 'shrinkage');

      // Remove columns from TestSeries table
      await queryInterface.removeColumn('TestSeries', 'variables');
      await queryInterface.removeColumn('TestSeries', 'goal');
      await queryInterface.removeColumn('TestSeries', 'status');
      await queryInterface.removeColumn('TestSeries', 'conclusions');

    } catch (error) {
      console.error('Migration Error:', error);
      throw error;
    }
  }
};
