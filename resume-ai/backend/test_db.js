require('dotenv').config();
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

console.log('--- Database Connection Test ---');
console.log('Connecting to:', MONGODB_URI?.split('@')[1] || 'UNDEFINED');

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('SUCCESS: Connected to MongoDB Cluster! ✅');
    console.log('Database Name:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.error('FAILURE: Could not connect to MongoDB ❌');
    console.error('Reason:', err.message);
    process.exit(1);
  });
