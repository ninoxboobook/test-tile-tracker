const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log
  }
);

async function runMigration() {
  try {
    // Get migration file name from command line arguments
    const migrationFile = process.argv[2];
    if (!migrationFile) {
      throw new Error('Please provide a migration file name as an argument');
    }

    console.log(`Running migration: ${migrationFile}`);
    
    // Import the migration file
    const migration = require(path.join('../migrations', migrationFile));
    
    // Run the migration
    await migration.up(sequelize.getQueryInterface(), Sequelize);
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await sequelize.close();
  }
}

runMigration();
