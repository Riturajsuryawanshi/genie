const axios = require('axios');

const BASE_URL = 'http://localhost:4000';

async function testAccountCreation() {
  console.log('🧪 Testing Account Creation...\n');

  try {
    // Test 1: Valid signup
    console.log('Test 1: Valid signup');
    const signupData = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      phone: '+1234567890'
    };

    const signupResponse = await axios.post(`${BASE_URL}/api/auth/signup`, signupData);
    console.log('✅ Signup successful:', signupResponse.data.message);
    console.log('User ID:', signupResponse.data.user._id);
    console.log('Token received:', !!signupResponse.data.token);

  } catch (error) {
    if (error.response) {
      console.log('❌ Signup failed:', error.response.data.error);
    } else {
      console.log('❌ Network error:', error.message);
    }
  }

  try {
    // Test 2: Invalid email
    console.log('\nTest 2: Invalid email format');
    const invalidEmailData = {
      email: 'invalid-email',
      password: 'password123',
      name: 'Test User'
    };

    await axios.post(`${BASE_URL}/api/auth/signup`, invalidEmailData);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Validation working:', error.response.data.error);
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }

  try {
    // Test 3: Short password
    console.log('\nTest 3: Short password');
    const shortPasswordData = {
      email: 'test2@example.com',
      password: '123',
      name: 'Test User'
    };

    await axios.post(`${BASE_URL}/api/auth/signup`, shortPasswordData);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Password validation working:', error.response.data.error);
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }

  try {
    // Test 4: Missing required fields
    console.log('\nTest 4: Missing required fields');
    const missingFieldsData = {
      email: 'test3@example.com'
      // Missing password and name
    };

    await axios.post(`${BASE_URL}/api/auth/signup`, missingFieldsData);
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Required field validation working:', error.response.data.error);
    } else {
      console.log('❌ Unexpected error:', error.message);
    }
  }

  console.log('\n🏁 Account creation tests completed!');
}

// Run the test
testAccountCreation().catch(console.error);