import mongoose from 'mongoose';
import dns from 'dns';
import { env } from './environment';

// Configure DNS for MongoDB Atlas SRV resolution on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if system restricts dns.setServers
}

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.set('strictQuery', true);

    const conn = await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error: any) {
    console.error(`❌ MongoDB Connection error: ${error.message}`);
    throw error;
  }

  mongoose.connection.on('error', (err) => {
    console.error(`MongoDB connection error: ${err.message}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed gracefully');
  } catch (error: any) {
    console.error('Error closing MongoDB connection:', error.message);
  }
}
