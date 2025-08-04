const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const UsageStats = require('./src/models/UsageStats');
const ActivityLog = require('./src/models/ActivityLog');
const Plan = require('./src/models/Plan');

async function addSampleData() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/callgenie';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Create sample users
    console.log('🔄 Creating sample users...');
    const users = await User.create([
      {
        email: 'john.doe@example.com',
        password: 'password123',
        name: 'John Doe',
        phone: '+1-555-0123',
        accountStatus: 'active'
      },
      {
        email: 'jane.smith@example.com',
        password: 'password123',
        name: 'Jane Smith',
        phone: '+1-555-0124',
        accountStatus: 'active'
      },
      {
        email: 'bob.wilson@example.com',
        password: 'password123',
        name: 'Bob Wilson',
        phone: '+1-555-0125',
        accountStatus: 'active'
      }
    ]);
    console.log(`✅ Created ${users.length} sample users`);

    // Create usage stats for each user
    console.log('🔄 Creating usage statistics...');
    const usageData = [
      { userId: users[0]._id, callsMade: 15, minutesUsed: 120, aiResponseRate: 89.5, voicemails: 3 },
      { userId: users[1]._id, callsMade: 8, minutesUsed: 67, aiResponseRate: 92.1, voicemails: 1 },
      { userId: users[2]._id, callsMade: 22, minutesUsed: 180, aiResponseRate: 85.7, voicemails: 5 }
    ];
    
    await UsageStats.create(usageData);
    console.log('✅ Created usage statistics');

    // Create activity logs
    console.log('🔄 Creating activity logs...');
    const activities = [];
    users.forEach(user => {
      activities.push(
        { userId: user._id, type: 'signup', description: 'User account created' },
        { userId: user._id, type: 'call', description: 'Made a phone call' },
        { userId: user._id, type: 'login', description: 'User logged in' }
      );
    });
    
    await ActivityLog.create(activities);
    console.log('✅ Created activity logs');

    // Create plans for each user
    console.log('🔄 Creating user plans...');
    const plans = [
      {
        userId: users[0]._id,
        planName: 'basic',
        features: { maxCalls: 50, maxMinutes: 300, aiSupport: true, voicemailTranscription: true, analytics: false }
      },
      {
        userId: users[1]._id,
        planName: 'free',
        features: { maxCalls: 10, maxMinutes: 60, aiSupport: true, voicemailTranscription: false, analytics: false }
      },
      {
        userId: users[2]._id,
        planName: 'premium',
        features: { maxCalls: 200, maxMinutes: 1000, aiSupport: true, voicemailTranscription: true, analytics: true }
      }
    ];
    
    await Plan.create(plans);
    console.log('✅ Created user plans');

    console.log('\n🎉 Sample data created successfully!');
    console.log('📊 Summary:');
    console.log(`   👥 Users: ${users.length}`);
    console.log(`   📊 Usage Stats: ${usageData.length}`);
    console.log(`   📋 Activity Logs: ${activities.length}`);
    console.log(`   💳 Plans: ${plans.length}`);
    console.log('\n💡 Now run: node view-data.js to see the data!');

  } catch (error) {
    if (error.code === 11000) {
      console.log('⚠️  Sample data already exists - skipping creation');
      console.log('💡 Run: node view-data.js to see existing data');
    } else {
      console.error('❌ Error creating sample data:', error.message);
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
addSampleData();