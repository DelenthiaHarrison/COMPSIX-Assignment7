require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.DB_STORAGE || './database/music_library.db',
  logging: false,
});

const Track = sequelize.define('Track', {
  trackId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  songTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  albumName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'tracks',
  timestamps: true,
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    await sequelize.sync({ force: false });
    console.log('✅ Database tables created successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  } finally {
    await sequelize.close();
    console.log('✅ Database connection closed.');
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = { sequelize, Track };