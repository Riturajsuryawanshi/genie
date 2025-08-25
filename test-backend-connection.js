// Test backend connection
const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    const response = await fetch('http://localhost:4001/health');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Backend is running successfully!');
      console.log('Services:', data.services);
    } else {
      console.log('❌ Backend responded but with error');
    }
  } catch (error) {
    console.log('❌ Backend is not running');
    console.log('💡 Please start the backend by running: cd backend && npm start');
  }
}

testBackend();