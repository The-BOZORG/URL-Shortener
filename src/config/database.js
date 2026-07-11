import mongoose from 'mongoose';

import { config } from './index.js';

export const connectDB = async () => {
  if (!config.MONGO_URI) throw new Error('Mongo URI is missing');

  try {
    await mongoose.connect(config.MONGO_URI);
    console.log('Connected to database successfully 🟢', {
      uri: config.MONGO_URI,
    });
  } catch (error) {
    console.error('MongoDB connect failed ⛔', error);
    if (config.NODE_ENV === 'development') {
      process.exit(1);
    }
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('Disconnect from database successfully 🔴', {
      uri: config.MONGO_URI,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    console.log('Error disconnect form database ⛔', error);
  }
};
