const mongoose = require('mongoose');
const { ExitCodes } = require('../utils/gracefulShutdown');
const connectDB = async () => {
    const connectionWithDbName = `${process.env.MONGO_URI}${process.env.MONGODB_ATTRS || ''}`;
  console.info(`Connecting to the database on host: ${connectionWithDbName}`);
  try {
    await mongoose.connect(connectionWithDbName, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Successfully connected to the database on host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', '\nFailed to connect to the database, please check the connection string and try again.', err.message);
    process.exit(ExitCodes.UNCAUGHT_FATAL_EXCEPTION);
  }
};

module.exports = connectDB;