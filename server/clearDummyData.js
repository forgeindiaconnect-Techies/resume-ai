const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Resume = require('./models/Resume');
const Payment = require('./models/Payment');
const Download = require('./models/Download');

async function clearData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    // 1. Find all users to delete (everyone except admin)
    const adminEmail = 'admin@forgeindia.com';
    const usersToDelete = await User.find({ email: { $ne: adminEmail } });
    
    // We also want to delete guest users that might not have an email or have empty email
    const allUsers = await User.find({});
    const usersToRemove = allUsers.filter(u => u.email !== adminEmail);
    const userIds = usersToRemove.map(u => u._id);

    console.log(`Found ${userIds.length} dummy/test users to delete.`);

    // 2. Delete Resumes associated with these users
    const deleteResumes = await Resume.deleteMany({ userId: { $in: userIds } });
    console.log(`Deleted ${deleteResumes.deletedCount} resumes.`);

    // 3. Delete Payments associated with these users
    const deletePayments = await Payment.deleteMany({ userId: { $in: userIds } });
    console.log(`Deleted ${deletePayments.deletedCount} payments.`);

    // 4. Delete Downloads associated with these users
    const deleteDownloads = await Download.deleteMany({ userId: { $in: userIds } });
    console.log(`Deleted ${deleteDownloads.deletedCount} downloads.`);

    // 5. Delete the users themselves
    const deleteUsers = await User.deleteMany({ _id: { $in: userIds } });
    console.log(`Deleted ${deleteUsers.deletedCount} users.`);

    // Also clear any orphaned records (just in case they have no userId)
    // Be careful not to delete templates or plans!
    // Since payments and downloads are entirely user-driven, any without a user might be dummy.
    // Let's delete any payments and downloads that don't belong to the admin user.
    const adminUser = await User.findOne({ email: adminEmail });
    if (adminUser) {
        const orphanPayments = await Payment.deleteMany({ userId: { $ne: adminUser._id } });
        console.log(`Deleted ${orphanPayments.deletedCount} orphan payments.`);
        
        const orphanDownloads = await Download.deleteMany({ userId: { $ne: adminUser._id } });
        console.log(`Deleted ${orphanDownloads.deletedCount} orphan downloads.`);

        const orphanResumes = await Resume.deleteMany({ userId: { $ne: adminUser._id } });
        console.log(`Deleted ${orphanResumes.deletedCount} orphan resumes.`);
    }

    console.log('Cleanup completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during cleanup:', error);
    process.exit(1);
  }
}

clearData();
