const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    const response = await fetch('http://localhost:4000/health');
    const data = await response.json();
    console.log('✅ Backend is running:', data);
  } catch (error) {
    console.log('❌ Backend is not running:', error.message);
    console.log('💡 Start backend with: cd backend && npm start');
  }
}

testBackend();