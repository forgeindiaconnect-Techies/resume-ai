import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
    employeeName: { type: String, required: true },
    email: { type: String, required: true },
    fileName: { type: String, required: true },
    filePath: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Check if model already exists to prevent OverwriteModelError in serverless
export default mongoose.models.Resume || mongoose.model('Resume', resumeSchema);
