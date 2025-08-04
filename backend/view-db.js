const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');
const UserProfile = require('./src/models/UserProfile');
const Conversation = require('./src/models/Conversation');

async function viewData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/callgenie');
    
    console.log('=== USERS ===');
    const users = await User.find().select('email name phone role createdAt');
    console.log(users);
    
    console.log('\n=== USER PROFILES ===');
    const profiles = await UserProfile.find().populate('userId', 'email name');
    console.log(profiles);
    
    console.log('\n=== CONVERSATIONS ===');
    const conversations = await Conversation.find().populate('userId', 'email').limit(5);
    console.log(conversations);
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

viewData();