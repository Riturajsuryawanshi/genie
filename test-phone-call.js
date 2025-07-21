// Test script to simulate a real phone call
const fetch = require('node-fetch');

async function simulatePhoneCall() {
  console.log('📞 Simulating a real phone call...\n');

  // Step 1: Simulate incoming call webhook
  console.log('1️⃣ Receiving incoming call webhook...');
  const webhookPayload = {
    CallSid: 'CA' + Date.now(),
    From: '+1234567890',
    To: '+1-555-CALLGENIE',
    RecordingUrl: 'https://exotel.com/test-recording.mp3',
    RecordingDuration: '30',
    CallStatus: 'completed'
  };

  try {
    const response = await fetch('http://localhost:4000/api/webhook/webhook', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookPayload)
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Call processed successfully!');
      console.log('📱 Caller:', result.caller);
      console.log('🤖 AI Response:', result.aiResponse);
      console.log('🆔 Call ID:', result.callId);
    } else {
      console.log('❌ Call processing failed:', result.error);
    }
  } catch (error) {
    console.log('❌ Error simulating call:', error.message);
  }

  console.log('\n🎯 This simulates what happens when someone calls your real number!');
  console.log('📞 To enable real calls, follow the setup guide in PHONE_NUMBER_SETUP.md');
}

// Run the simulation
simulatePhoneCall(); 