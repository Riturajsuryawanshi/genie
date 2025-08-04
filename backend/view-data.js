const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const UsageStats = require('./src/models/UsageStats');
const ActivityLog = require('./src/models/ActivityLog');
const Plan = require('./src/models/Plan');

async function viewData() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/callgenie';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
    console.log('==========================================');

    // View Users
    console.log('\n👥 USERS:');
    console.log('==========================================');
    const users = await User.find({}).select('email name phone accountStatus createdAt');
    if (users.length === 0) {
      console.log('📝 No users found. Create some users first!');
    } else {
      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.name} (${user.email})`);
        console.log(`   Phone: ${user.phone || 'Not provided'}`);
        console.log(`   Status: ${user.accountStatus}`);
        console.log(`   Created: ${user.createdAt.toDateString()}`);
        console.log(`   ID: ${user._id}`);
        console.log('');
      });
    }

    // View Usage Stats
    console.log('\n📊 USAGE STATISTICS:');
    console.log('==========================================');
    const usageStats = await UsageStats.find({}).populate('userId', 'name email');
    if (usageStats.length === 0) {
      console.log('📝 No usage stats found.');
    } else {
      usageStats.forEach((stat, index) => {
        console.log(`${index + 1}. User: ${stat.userId?.name || 'Unknown'} (${stat.userId?.email || 'Unknown'})`);
        console.log(`   Calls Made: ${stat.callsMade}`);
        console.log(`   Minutes Used: ${stat.minutesUsed}`);
        console.log(`   AI Response Rate: ${stat.aiResponseRate}%`);
        console.log(`   Voicemails: ${stat.voicemails}`);
        console.log('');
      });
    }

    // View Activity Logs
    console.log('\n📋 RECENT ACTIVITY:');
    console.log('==========================================');
    const activities = await ActivityLog.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    
    if (activities.length === 0) {
      console.log('📝 No activity logs found.');
    } else {
      activities.forEach((activity, index) => {
        console.log(`${index + 1}. ${activity.type.toUpperCase()}: ${activity.description}`);
        console.log(`   User: ${activity.userId?.name || 'Unknown'} (${activity.userId?.email || 'Unknown'})`);
        console.log(`   Date: ${activity.createdAt.toLocaleString()}`);
        console.log('');
      });
    }

    // View Plans
    console.log('\n💳 USER PLANS:');
    console.log('==========================================');
    const plans = await Plan.find({}).populate('userId', 'name email');
    if (plans.length === 0) {
      console.log('📝 No plans found.');
    } else {
      plans.forEach((plan, index) => {
        console.log(`${index + 1}. User: ${plan.userId?.name || 'Unknown'} (${plan.userId?.email || 'Unknown'})`);
        console.log(`   Plan: ${plan.planName.toUpperCase()}`);
        console.log(`   Status: ${plan.status}`);
        console.log(`   Max Calls: ${plan.features.maxCalls}`);
        console.log(`   Max Minutes: ${plan.features.maxMinutes}`);
        console.log(`   AI Support: ${plan.features.aiSupport ? 'Yes' : 'No'}`);
        console.log('');
      });
    }

    console.log('==========================================');
    console.log('📊 Database Summary:');
    console.log(`👥 Total Users: ${users.length}`);
    console.log(`📊 Usage Records: ${usageStats.length}`);
    console.log(`📋 Activity Logs: ${activities.length}`);
    console.log(`💳 Plans: ${plans.length}`);
    console.log('==========================================');

  } catch (error) {
    console.error('❌ Error viewing data:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the viewer
viewData();