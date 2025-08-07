const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Configuration checks
const checks = {
  passed: 0,
  failed: 0,
  warnings: 0,
  total: 0
};

function logPass(message) {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
  checks.passed++;
  checks.total++;
}

function logFail(message) {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
  checks.failed++;
  checks.total++;
}

function logWarning(message) {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
  checks.warnings++;
  checks.total++;
}

function logInfo(message) {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
}

// Check environment variables
function checkEnvironmentVariables() {
  console.log(`\n${colors.blue}🔧 Checking Environment Variables${colors.reset}`);
  console.log('='.repeat(50));
  
  const requiredVars = [
    'MONGODB_URL',
    'JWT_SECRET',
    'OPENAI_API_KEY',
    'PORT'
  ];
  
  const optionalVars = [
    'NODE_ENV',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ];
  
  // Check required variables
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      logPass(`${varName} is set`);
    } else {
      logFail(`${varName} is missing (required)`);
    }
  });
  
  // Check optional variables
  optionalVars.forEach(varName => {
    if (process.env[varName]) {
      logPass(`${varName} is set`);
    } else {
      logWarning(`${varName} is not set (optional)`);
    }
  });
  
  // Check JWT secret strength
  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      logWarning('JWT_SECRET should be at least 32 characters long');
    } else {
      logPass('JWT_SECRET has adequate length');
    }
    
    if (process.env.JWT_SECRET.includes('change-this') || process.env.JWT_SECRET.includes('secret')) {
      logFail('JWT_SECRET appears to be a default value - change it!');
    } else {
      logPass('JWT_SECRET appears to be customized');
    }
  }
  
  // Check NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    logPass('NODE_ENV is set to production');
  } else {
    logWarning('NODE_ENV is not set to production');
  }
}

// Check file structure
function checkFileStructure() {
  console.log(`\n${colors.blue}📁 Checking File Structure${colors.reset}`);
  console.log('='.repeat(50));
  
  const requiredFiles = [
    'src/index.js',
    'src/routes/auth-mongodb.js',
    'src/routes/webhook.js',
    'src/routes/contact.js',
    'src/routes/user.js',
    'src/models/User.js',
    'src/models/ContactMessage.js',
    'src/services/config/mongodb.js',
    'package.json'
  ];
  
  const requiredDirs = [
    'src',
    'src/routes',
    'src/models',
    'src/services',
    'src/services/config'
  ];
  
  // Check directories
  requiredDirs.forEach(dir => {
    if (fs.existsSync(path.join(__dirname, dir))) {
      logPass(`Directory ${dir} exists`);
    } else {
      logFail(`Directory ${dir} is missing`);
    }
  });
  
  // Check files
  requiredFiles.forEach(file => {
    if (fs.existsSync(path.join(__dirname, file))) {
      logPass(`File ${file} exists`);
    } else {
      logFail(`File ${file} is missing`);
    }
  });
}

// Check package.json
function checkPackageJson() {
  console.log(`\n${colors.blue}📦 Checking Package Configuration${colors.reset}`);
  console.log('='.repeat(50));
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
    
    // Check scripts
    if (packageJson.scripts?.start) {
      logPass('Start script is defined');
    } else {
      logFail('Start script is missing');
    }
    
    if (packageJson.scripts?.dev) {
      logPass('Dev script is defined');
    } else {
      logWarning('Dev script is missing');
    }
    
    // Check dependencies
    const requiredDeps = [
      'express',
      'mongoose',
      'cors',
      'dotenv',
      'jsonwebtoken',
      'bcryptjs',
      'axios',
      'openai'
    ];
    
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies?.[dep]) {
        logPass(`Dependency ${dep} is installed`);
      } else {
        logFail(`Dependency ${dep} is missing`);
      }
    });
    
  } catch (error) {
    logFail(`Error reading package.json: ${error.message}`);
  }
}

// Check MongoDB connection string
function checkMongoDBConfig() {
  console.log(`\n${colors.blue}🗄️  Checking MongoDB Configuration${colors.reset}`);
  console.log('='.repeat(50));
  
  const mongoUrl = process.env.MONGODB_URL;
  
  if (!mongoUrl) {
    logFail('MONGODB_URL is not set');
    return;
  }
  
  if (mongoUrl.startsWith('mongodb+srv://')) {
    logPass('Using MongoDB Atlas (cloud) connection');
  } else if (mongoUrl.startsWith('mongodb://')) {
    logPass('Using MongoDB connection');
  } else {
    logFail('Invalid MongoDB connection string format');
  }
  
  // Check if credentials are in URL
  if (mongoUrl.includes('@')) {
    logPass('MongoDB connection includes credentials');
  } else {
    logWarning('MongoDB connection may be missing credentials');
  }
}

// Check OpenAI configuration
function checkOpenAIConfig() {
  console.log(`\n${colors.blue}🤖 Checking OpenAI Configuration${colors.reset}`);
  console.log('='.repeat(50));
  
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    logFail('OPENAI_API_KEY is not set');
    return;
  }
  
  if (apiKey.startsWith('sk-')) {
    logPass('OpenAI API key format is correct');
  } else {
    logFail('OpenAI API key format is invalid');
  }
  
  if (apiKey.length > 50) {
    logPass('OpenAI API key has adequate length');
  } else {
    logWarning('OpenAI API key seems too short');
  }
}

// Check security configurations
function checkSecurity() {
  console.log(`\n${colors.blue}🔒 Checking Security Configuration${colors.reset}`);
  console.log('='.repeat(50));
  
  // Check if CORS is properly configured
  try {
    const indexFile = fs.readFileSync(path.join(__dirname, 'src/index.js'), 'utf8');
    
    if (indexFile.includes('cors()')) {
      logPass('CORS is enabled');
    } else {
      logWarning('CORS may not be properly configured');
    }
    
    if (indexFile.includes('express.json()')) {
      logPass('JSON body parser is enabled');
    } else {
      logFail('JSON body parser is missing');
    }
    
    if (indexFile.includes('rate-limit') || indexFile.includes('rateLimit')) {
      logPass('Rate limiting is implemented');
    } else {
      logWarning('Rate limiting may not be implemented');
    }
    
  } catch (error) {
    logFail(`Error checking security configuration: ${error.message}`);
  }
}

// Check Hostinger specific requirements
function checkHostingerRequirements() {
  console.log(`\n${colors.blue}🌐 Checking Hostinger Deployment Requirements${colors.reset}`);
  console.log('='.repeat(50));
  
  // Check port configuration
  const port = process.env.PORT;
  if (port) {
    logPass(`PORT is configured (${port})`);
  } else {
    logWarning('PORT environment variable not set (will use default 4000)');
  }
  
  // Check if using process.env.PORT in code
  try {
    const indexFile = fs.readFileSync(path.join(__dirname, 'src/index.js'), 'utf8');
    
    if (indexFile.includes('process.env.PORT')) {
      logPass('Code uses process.env.PORT for dynamic port assignment');
    } else {
      logFail('Code should use process.env.PORT for Hostinger compatibility');
    }
    
  } catch (error) {
    logFail(`Error checking port configuration: ${error.message}`);
  }
  
  // Check for production optimizations
  if (process.env.NODE_ENV === 'production') {
    logPass('NODE_ENV is set to production');
  } else {
    logWarning('Set NODE_ENV=production for better performance');
  }
  
  logInfo('For Hostinger deployment:');
  logInfo('1. Use Node.js hosting plan');
  logInfo('2. Set environment variables in hosting panel');
  logInfo('3. Upload files to public_html or app directory');
  logInfo('4. Configure startup file as src/index.js');
  logInfo('5. Ensure MongoDB Atlas is accessible from Hostinger IPs');
}

// Main function
function runProductionCheck() {
  console.log(`${colors.yellow}🚀 CallGenie V2 Production Readiness Check${colors.reset}`);
  console.log(`${colors.yellow}${'='.repeat(60)}${colors.reset}`);
  
  checkEnvironmentVariables();
  checkFileStructure();
  checkPackageJson();
  checkMongoDBConfig();
  checkOpenAIConfig();
  checkSecurity();
  checkHostingerRequirements();
  
  // Summary
  console.log(`\n${colors.yellow}📊 Summary${colors.reset}`);
  console.log('='.repeat(50));
  console.log(`Total Checks: ${checks.total}`);
  console.log(`${colors.green}Passed: ${checks.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${checks.failed}${colors.reset}`);
  console.log(`${colors.yellow}Warnings: ${checks.warnings}${colors.reset}`);
  
  const score = ((checks.passed / checks.total) * 100).toFixed(1);
  console.log(`Production Readiness Score: ${score}%`);
  
  if (checks.failed === 0) {
    console.log(`\n${colors.green}🎉 Your application is ready for production deployment!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}⚠️  Please fix the failed checks before deploying to production.${colors.reset}`);
  }
  
  console.log(`\n${colors.blue}🔗 Next Steps for Hostinger Deployment:${colors.reset}`);
  console.log('1. Fix any failed checks above');
  console.log('2. Test all API endpoints using: node test-api-endpoints.js');
  console.log('3. Upload your code to Hostinger');
  console.log('4. Configure environment variables in Hostinger panel');
  console.log('5. Set startup file to src/index.js');
  console.log('6. Test your deployed API endpoints');
}

// Run the check
if (require.main === module) {
  runProductionCheck();
}

module.exports = { runProductionCheck };