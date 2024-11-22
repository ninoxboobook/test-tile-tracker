const { DataTypes } = require('sequelize');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // First, check if the old column exists
      const tableInfo = await queryInterface.describeTable('TestTiles');
      if (tableInfo.TestSeryId) {
        // If the old column exists, rename it
        await queryInterface.renameColumn('TestTiles', 'TestSeryId', 'testSeriesId');
      } else if (!tableInfo.testSeriesId) {
        // If neither column exists, create the new one
        await queryInterface.addColumn('TestTiles', 'testSeriesId', {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'TestSeries',
            key: 'id'
          }
        });
      }
    } catch (error) {
      console.error('Migration Error:', error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      const tableInfo = await queryInterface.describeTable('TestTiles');
      if (tableInfo.testSeriesId) {
        await queryInterface.renameColumn('TestTiles', 'testSeriesId', 'TestSeryId');
      }
    } catch (error) {
      console.error('Migration Error:', error);
      throw error;
    }
  }
};
