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
const envExamplePath = path.join(__dirname, '.env.example');

// Create a .env.example if it doesn't exist to serve as a template
if (!fs.existsSync(envExamplePath)) {
    const exampleContent = [
        '# MongoDB Connection',
        'MONGODB_URI=your_mongodb_connection_string',
        '',
        '# JWT Secret - A new one will be generated if this is a placeholder',
        'JWT_SECRET=your_super_secret_key_for_jwt',
        '',
        '# Google OAuth Credentials',
        'GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com',
        'GOOGLE_CLIENT_SECRET=your_google_client_secret',
        '',
        '# Frontend URL (e.g., http://localhost:5173 or https://supernovaind.com)',
        'FRONTEND_URL=http://localhost:5173'
    ].join('\n');
    fs.writeFileSync(envExamplePath, exampleContent);
    console.log('✅ Created .env.example file. Use it as a template.');
}

// If .env doesn't exist, copy from .env.example
if (!fs.existsSync(envPath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('❌ .env file not found. A new .env file has been created from the template.');
    console.log('   Please update it with your actual credentials.');
}

  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Check for required variables
  const requiredVars = [
    'JWT_SECRET', 
    'MONGODB_URI', 
    'GOOGLE_CLIENT_ID', 
    'GOOGLE_CLIENT_SECRET',
    'FRONTEND_URL' // e.g., http://localhost:3000 or https://supernovaind.com
  ];
  const missingVars = [];

  const jwtSecretLine = envContent.split('\n').find(line => line.startsWith('JWT_SECRET='));
  const jwtIsPlaceholder = !jwtSecretLine || jwtSecretLine.includes('your_') || jwtSecretLine.split('=')[1].trim() === '';
  
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

// 3. Generate a secure JWT secret if it's missing or a placeholder
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const jwtIsPlaceholder = !envContent.includes('JWT_SECRET=') || envContent.includes('JWT_SECRET=your_');
  if (jwtIsPlaceholder) {
    const crypto = require('crypto');
    const secureJwtSecret = crypto.randomBytes(64).toString('hex');
    console.log('\n🔐 Your JWT_SECRET is missing or is a placeholder. Use this generated one in your .env file:');
    console.log(`JWT_SECRET=${secureJwtSecret}`);
  }
}
console.log('\n🚀 Server fix completed!');
console.log('\nNext steps:');
console.log('1. Update your .env file with the JWT_SECRET above');
console.log('2. Make sure MongoDB is running (or use MongoDB Atlas)');
console.log('3. Run: npm run dev');
console.log('4. Test account creation with: node test-account-creation.js');