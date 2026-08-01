import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.warn('[DB] MONGODB_URI is not defined. Falling back to local development URI.');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development and serverless invocations.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log('[DB] Using cached MongoDB connection');
    return cached.conn;
  }

  // VALIDATION: Provide clear instructions in logs if URI is missing
  if (!MONGODB_URI) {
    console.error('[DB] CRITICAL ERROR: MONGODB_URI is missing in Vercel settings.');
    console.warn('[DB] ACTION REQUIRED: Add MONGODB_URI to Vercel Project Settings > Environment Variables.');
    return null; 
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      connectTimeoutMS: 15000, // Increased to 15s for slow cold starts
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      family: 4 // Force IPv4 to avoid DNS resolution delays
    };

    console.log('[DB] Attempting new MongoDB connection...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('[DB] MongoDB connection established successfully ✅');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Clear promise so retry is possible on next request
    console.error('[DB] CRITICAL: Failed to connect to MongoDB ❌');
    console.error(`[DB] Error Message: ${e.message}`);
    
    if (e.message.includes('ETIMEDOUT') || e.message.includes('selection timeout')) {
      console.error('[DB] Recommendation: Check if your MongoDB Atlas IP Whitelist includes 0.0.0.0/0');
    }
    
    throw e;
  }

  return cached.conn;
}

export default dbConnect;

