const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add missing fields to Decorations table
      await queryInterface.addColumn('Decorations', 'cone', {
        type: DataTypes.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('Decorations', 'applicationMethod', {
        type: DataTypes.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('Decorations', 'color', {
        type: DataTypes.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('Decorations', 'surface', {
        type: DataTypes.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('Decorations', 'transparency', {
        type: DataTypes.STRING,
        allowNull: true
      });

    } catch (error) {
      console.error('Migration Error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Remove columns from Decorations table
      await queryInterface.removeColumn('Decorations', 'cone');
      await queryInterface.removeColumn('Decorations', 'applicationMethod');
      await queryInterface.removeColumn('Decorations', 'color');
      await queryInterface.removeColumn('Decorations', 'surface');
      await queryInterface.removeColumn('Decorations', 'transparency');

    } catch (error) {
      console.error('Migration Error:', error);
      throw error;
    }
  }
};
