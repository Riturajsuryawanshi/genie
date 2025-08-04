const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const UserProfile = require('./src/models/UserProfile');
const Conversation = require('./src/models/Conversation');

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/callgenie';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Create indexes
    await User.createIndexes();
    await UserProfile.createIndexes();
    await Conversation.createIndexes();
    console.log('✅ Database indexes created');

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@callgenie.com' });
    if (!adminExists) {
      const adminUser = new User({
        email: 'admin@callgenie.com',
        password: 'admin123',
        name: 'Admin User',
        role: 'admin'
      });
      await adminUser.save();

      const adminProfile = new UserProfile({
        userId: adminUser._id,
        subscription: {
          plan: 'enterprise',
          status: 'active'
        }
      });
      await adminProfile.save();

      console.log('✅ Admin user created');
    }

    console.log('🎉 Database initialization completed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();