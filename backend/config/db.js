const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

let sequelize;

if (process.env.DATABASE_URL) {
  // Explicitly require pg so Vercel bundler includes it
  require('pg');
  require('pg-hstore');
  
  // Use Postgres in Production/Vercel
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Required for some cloud providers like Neon/Render
      }
    },
    logging: false
  });
} else {
  // Fallback to SQLite for Local Development
  const dbStorage = process.env.DB_STORAGE || './database.sqlite';
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.isAbsolute(dbStorage) ? dbStorage : path.join(__dirname, '..', dbStorage),
    logging: false
  });
}

module.exports = sequelize;
