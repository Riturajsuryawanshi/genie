// Test backend connection
const fetch = require('node-fetch');

async function testBackend() {
  try {
    console.log('Testing backend connection...');
    
    const response = await fetch('http://localhost:4000/health');
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Backend is running successfully!');
      console.log('Services:', data.services);
    } else {
      console.log('❌ Backend responded but with error');
    }
  } catch (error) {
    console.log('❌ Backend is not running');
    console.log('Please run: npm run dev in the backend folder');
    console.log('Or double-click start-backend.bat');
  }
}

testBackend();