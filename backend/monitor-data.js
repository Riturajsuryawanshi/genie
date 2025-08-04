const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const UsageStats = require('./src/models/UsageStats');
const ActivityLog = require('./src/models/ActivityLog');
const Plan = require('./src/models/Plan');

async function monitorData() {
  try {
    console.log('🔄 Starting MongoDB data monitor...');
    
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/callgenie';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    // Monitor function
    const checkData = async () => {
      console.clear();
      console.log('📊 MONGODB DATA MONITOR - Live View');
      console.log('=====================================');
      console.log(`🕐 Last updated: ${new Date().toLocaleString()}`);
      console.log('=====================================\n');

      // Get counts
      const userCount = await User.countDocuments();
      const usageCount = await UsageStats.countDocuments();
      const activityCount = await ActivityLog.countDocuments();
      const planCount = await Plan.countDocuments();

      console.log('📈 Quick Stats:');
      console.log(`   👥 Users: ${userCount}`);
      console.log(`   📊 Usage Records: ${usageCount}`);
      console.log(`   📋 Activity Logs: ${activityCount}`);
      console.log(`   💳 Plans: ${planCount}\n`);

      // Show latest users
      if (userCount > 0) {
        console.log('👥 Latest Users:');
        const latestUsers = await User.find({})
          .select('name email createdAt')
          .sort({ createdAt: -1 })
          .limit(3);
        
        latestUsers.forEach((user, index) => {
          console.log(`   ${index + 1}. ${user.name} - ${user.email}`);
        });
        console.log('');
      }

      // Show latest activity
      if (activityCount > 0) {
        console.log('📋 Latest Activity:');
        const latestActivity = await ActivityLog.find({})
          .populate('userId', 'name')
          .sort({ createdAt: -1 })
          .limit(5);
        
        latestActivity.forEach((activity, index) => {
          console.log(`   ${index + 1}. ${activity.type.toUpperCase()}: ${activity.description}`);
          console.log(`      User: ${activity.userId?.name || 'Unknown'}`);
        });
        console.log('');
      }

      console.log('=====================================');
      console.log('Press Ctrl+C to stop monitoring');
      console.log('Data refreshes every 5 seconds...');
    };

    // Initial check
    await checkData();

    // Set up interval for monitoring
    const intervalId = setInterval(checkData, 5000);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      clearInterval(intervalId);
      await mongoose.disconnect();
      console.log('\n🔌 Disconnected from MongoDB');
      console.log('👋 Monitor stopped');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error starting monitor:', error.message);
    process.exit(1);
  }
}

// Start monitoring
monitorData();