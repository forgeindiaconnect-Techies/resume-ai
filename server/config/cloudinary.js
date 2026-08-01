const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ai-builder',
  api_key: process.env.CLOUDINARY_API_KEY || '295332122439216',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'W3bG0rs6HdyOV5YytYiq71Htz2Q',
  secure: true
});

module.exports = cloudinary;
