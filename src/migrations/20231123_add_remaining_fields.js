const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Add remaining fields to ClayBodies table
      await queryInterface.addColumn('ClayBodies', 'absorption', {
        type: DataTypes.FLOAT,
        allowNull: true
      });
      await queryInterface.addColumn('ClayBodies', 'plasticity', {
        type: DataTypes.STRING,
        allowNull: true
      });
      await queryInterface.addColumn('ClayBodies', 'texture', {
        type: DataTypes.STRING,
        allowNull: true
      });

      // Add remaining fields to Decorations table
      await queryInterface.addColumn('Decorations', 'manufacturer', {
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
      // Remove columns from ClayBodies table
      await queryInterface.removeColumn('ClayBodies', 'absorption');
      await queryInterface.removeColumn('ClayBodies', 'plasticity');
      await queryInterface.removeColumn('ClayBodies', 'texture');

      // Remove columns from Decorations table
      await queryInterface.removeColumn('Decorations', 'manufacturer');

    } catch (error) {
      console.error('Migration Error:', error);
      throw error;
    }
  }
};
