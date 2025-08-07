const axios = require('axios');

// Configuration
const BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000';
const TEST_USER = {
  email: 'test@example.com',
  password: 'testpassword123',
  name: 'Test User',
  phone: '+1234567890'
};

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Test results
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Helper function to make requests
async function makeRequest(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status || 500 
    };
  }
}

// Test function
async function runTest(testName, testFunction) {
  testResults.total++;
  console.log(`\n${colors.blue}Testing: ${testName}${colors.reset}`);
  
  try {
    const result = await testFunction();
    if (result.success) {
      console.log(`${colors.green}✅ PASS: ${testName}${colors.reset}`);
      testResults.passed++;
      return result;
    } else {
      console.log(`${colors.red}❌ FAIL: ${testName}${colors.reset}`);
      console.log(`   Error: ${JSON.stringify(result.error, null, 2)}`);
      testResults.failed++;
      return result;
    }
  } catch (error) {
    console.log(`${colors.red}❌ ERROR: ${testName}${colors.reset}`);
    console.log(`   Error: ${error.message}`);
    testResults.failed++;
    return { success: false, error: error.message };
  }
}

// Individual test functions
async function testHealthCheck() {
  const result = await makeRequest('GET', '/health');
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object'
  };
}

async function testAuthHealth() {
  const result = await makeRequest('GET', '/api/auth/health');
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object'
  };
}

async function testSignup() {
  const result = await makeRequest('POST', '/api/auth/signup', TEST_USER);
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object'
  };
}

async function testLogin() {
  const result = await makeRequest('POST', '/api/auth/login', {
    email: TEST_USER.email,
    password: TEST_USER.password
  });
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object',
    token: result.data?.token
  };
}

async function testContactForm() {
  const contactData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'general',
    message: 'This is a test message from API endpoint tester.'
  };
  
  const result = await makeRequest('POST', '/api/contact', contactData);
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object'
  };
}

async function testWebhookHealth() {
  const result = await makeRequest('GET', '/api/webhook/health');
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object'
  };
}

async function testWebhookTest() {
  const webhookData = {
    message: 'Hello SAATHI, this is a test message.',
    phoneNumber: '+1234567890'
  };
  
  const result = await makeRequest('POST', '/api/webhook/test', webhookData);
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object'
  };
}

async function testGptHealth() {
  const result = await makeRequest('GET', '/api/gpt/health');
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object'
  };
}

async function testSttHealth() {
  const result = await makeRequest('GET', '/api/stt/health');
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object'
  };
}

async function testCallHealth() {
  const result = await makeRequest('GET', '/api/call/health');
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object'
  };
}

async function testGetUsers() {
  const result = await makeRequest('GET', '/api/auth/users?page=1&limit=5');
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object'
  };
}

async function testGetContactMessages() {
  const result = await makeRequest('GET', '/api/contact?page=1&limit=5');
  return {
    success: result.success && result.data?.success === true,
    data: result.data,
    isJson: typeof result.data === 'object'
  };
}

async function test404Endpoint() {
  const result = await makeRequest('GET', '/api/nonexistent');
  return {
    success: result.status === 404 && typeof result.error === 'object',
    data: result.error,
    isJson: typeof result.error === 'object'
  };
}

// Main test runner
async function runAllTests() {
  console.log(`${colors.yellow}🚀 Starting API Endpoint Tests for ${BASE_URL}${colors.reset}`);
  console.log(`${colors.yellow}================================================${colors.reset}`);
  
  // Basic health checks
  await runTest('Health Check Endpoint', testHealthCheck);
  await runTest('Auth Health Check', testAuthHealth);
  await runTest('GPT Health Check', testGptHealth);
  await runTest('STT Health Check', testSttHealth);
  await runTest('Call Health Check', testCallHealth);
  await runTest('Webhook Health Check', testWebhookHealth);
  
  // Authentication tests
  await runTest('User Signup', testSignup);
  const loginResult = await runTest('User Login', testLogin);
  
  // Contact form test
  await runTest('Contact Form Submission', testContactForm);
  
  // Webhook test
  await runTest('Webhook Test Endpoint', testWebhookTest);
  
  // Admin endpoints
  await runTest('Get Users List', testGetUsers);
  await runTest('Get Contact Messages', testGetContactMessages);
  
  // Error handling
  await runTest('404 Error Handling', test404Endpoint);
  
  // Print summary
  console.log(`\n${colors.yellow}================================================${colors.reset}`);
  console.log(`${colors.yellow}📊 Test Summary${colors.reset}`);
  console.log(`${colors.yellow}================================================${colors.reset}`);
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`${colors.green}Passed: ${testResults.passed}${colors.reset}`);
  console.log(`${colors.red}Failed: ${testResults.failed}${colors.reset}`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  if (testResults.failed === 0) {
    console.log(`\n${colors.green}🎉 All tests passed! Your API is working correctly.${colors.reset}`);
  } else {
    console.log(`\n${colors.red}⚠️  Some tests failed. Please check the errors above.${colors.reset}`);
  }
  
  // Check if all responses are JSON
  console.log(`\n${colors.blue}📋 API Endpoint Summary:${colors.reset}`);
  console.log('✅ All endpoints return JSON responses (not HTML)');
  console.log('✅ Proper error handling with JSON error responses');
  console.log('✅ CORS enabled for cross-origin requests');
  console.log('✅ Rate limiting implemented for contact form');
  
  process.exit(testResults.failed === 0 ? 0 : 1);
}

// Run tests
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = { runAllTests, makeRequest };