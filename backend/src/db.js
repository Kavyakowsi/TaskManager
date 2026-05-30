const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const connStr = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmanager';
    console.log(`Connecting to MongoDB at: ${connStr.replace(/:([^:@]+)@/, ':***@')}`);
    
    await mongoose.connect(connStr);
    
    console.log('MongoDB Connected Successfully.');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
