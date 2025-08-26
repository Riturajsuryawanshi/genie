const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing CallGenie Backend Server...\n');

// 1. Check if uploads directories exist
const uploadsDir = path.join(__dirname, 'uploads');
const audioDir = path.join(uploadsDir, 'audio');
const processedDir = path.join(uploadsDir, 'processed');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log('✅ Created uploads directory');
}

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir);
  console.log('✅ Created uploads/audio directory');
}

if (!fs.existsSync(processedDir)) {
  fs.mkdirSync(processedDir);
  console.log('✅ Created uploads/processed directory');
}

// 2. Check .env file
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found');
  console.log('Please create .env file with required configuration');
} else {
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check for required variables
  const requiredVars = ['JWT_SECRET', 'MONGODB_URI'];
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (!envContent.includes(varName) || envContent.includes(`${varName}=your_`)) {
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log('⚠️  Missing or incomplete environment variables:');
    missingVars.forEach(varName => {
      console.log(`   - ${varName}`);
    });
    console.log('\nPlease update your .env file with actual values');
  } else {
    console.log('✅ Environment variables configured');
  }
}

// 3. Generate a secure JWT secret if needed
const crypto = require('crypto');
const secureJwtSecret = crypto.randomBytes(64).toString('hex');
console.log('\n🔐 Generated secure JWT secret (use this in your .env):');
console.log(`JWT_SECRET=${secureJwtSecret}`);

console.log('\n🚀 Server fix completed!');
console.log('\nNext steps:');
console.log('1. Update your .env file with the JWT_SECRET above');
console.log('2. Make sure MongoDB is running (or use MongoDB Atlas)');
console.log('3. Run: npm run dev');
console.log('4. Test account creation with: node test-account-creation.js');