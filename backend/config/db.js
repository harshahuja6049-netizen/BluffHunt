// backend/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  // Validate MONGO_URI exists
  if (!process.env.MONGO_URI) {
    console.error('❌ MONGO_URI is missing. Set it in backend/.env or your host environment.');
    process.exit(1);
  }

  try {
    // Connection options for better reliability
    const options = {
      serverSelectionTimeoutMS: 15000, // Wait 15s for server selection
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      writeConcern: {
        w: 'majority'
      }
    };

    await mongoose.connect(process.env.MONGO_URI, options);
    console.log('✅ MongoDB Connected Successfully!');
    
    // Log connection events
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB connection established');
    });

    mongoose.connection.on('error', (err) => {
      console.error(`❌ MongoDB connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB connection disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('⚠️ MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;