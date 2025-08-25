async function testGPTEndpoint() {
  try {
    console.log('Testing GPT endpoint...');
    
    const response = await fetch('http://localhost:4000/api/gpt/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message: 'Hello, how are you?',
        conversationHistory: []
      })
    });
    
    const data = await response.json();
    console.log('Response:', data);
    
    if (data.success) {
      console.log('✅ GPT endpoint working correctly');
    } else {
      console.log('❌ GPT endpoint error:', data.error);
    }
  } catch (error) {
    console.log('❌ Connection error:', error.message);
  }
}

testGPTEndpoint();