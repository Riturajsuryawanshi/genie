const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const UsageStats = require('./src/models/UsageStats');
const ActivityLog = require('./src/models/ActivityLog');
const Plan = require('./src/models/Plan');

async function testMongoDB() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/callgenie';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');

    // Test creating a user
    console.log('🔄 Testing user creation...');
    const testUser = new User({
      email: `test${Date.now()}@test.com`,
      password: 'testpassword123',
      name: 'Test User',
      phone: '+1234567890'
    });

    await testUser.save();
    console.log('✅ Test user created:', testUser.email);

    // Test creating usage stats
    console.log('🔄 Testing usage stats creation...');
    const usageStats = new UsageStats({
      userId: testUser._id,
      callsMade: 5,
      minutesUsed: 30,
      aiResponseRate: 85.5,
      voicemails: 2
    });

    await usageStats.save();
    console.log('✅ Usage stats created');

    // Test creating activity log
    console.log('🔄 Testing activity log creation...');
    const activityLog = new ActivityLog({
      userId: testUser._id,
      type: 'signup',
      description: 'Test user account created'
    });

    await activityLog.save();
    console.log('✅ Activity log created');

    // Test creating plan
    console.log('🔄 Testing plan creation...');
    const plan = new Plan({
      userId: testUser._id,
      planName: 'free',
      features: {
        maxCalls: 10,
        maxMinutes: 60,
        aiSupport: true,
        voicemailTranscription: false,
        analytics: false
      }
    });

    await plan.save();
    console.log('✅ Plan created');

    // Test password comparison
    console.log('🔄 Testing password comparison...');
    const isPasswordValid = await testUser.comparePassword('testpassword123');
    console.log('✅ Password comparison works:', isPasswordValid);

    // Test queries
    console.log('🔄 Testing database queries...');
    const foundUser = await User.findById(testUser._id);
    const foundUsage = await UsageStats.findOne({ userId: testUser._id });
    const foundActivity = await ActivityLog.find({ userId: testUser._id });
    const foundPlan = await Plan.findOne({ userId: testUser._id });

    console.log('✅ Query tests passed');
    console.log('  - Found user:', !!foundUser);
    console.log('  - Found usage stats:', !!foundUsage);
    console.log('  - Found activity logs:', foundActivity.length);
    console.log('  - Found plan:', !!foundPlan);

    // Cleanup test data
    console.log('🔄 Cleaning up test data...');
    await User.findByIdAndDelete(testUser._id);
    await UsageStats.deleteOne({ userId: testUser._id });
    await ActivityLog.deleteMany({ userId: testUser._id });
    await Plan.deleteOne({ userId: testUser._id });
    console.log('✅ Test data cleaned up');

    console.log('\n🎉 All MongoDB tests passed successfully!');
    console.log('📝 Your MongoDB setup is working correctly.');
    console.log('📝 You can now start the server with: npm start');

  } catch (error) {
    console.error('❌ MongoDB test failed:', error.message);
    console.error('📝 Please check your MongoDB connection and try again.');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Make sure MongoDB is running on your system.');
    }
    
    if (error.name === 'MongoServerError' && error.code === 11000) {
      console.error('💡 User already exists - this is expected in testing.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the test
testMongoDB();