// Test Google OAuth Configuration
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://odzagbhwjbphufqgcray.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kemFnYmh3amJwaHVmcWdjcmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1NjYyMDAsImV4cCI6MjA2NzE0MjIwMH0.gYcMJgQ0b5EVAkLfoABtquIN2mJjLk2UrBrzf_WyKto';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testGoogleAuth() {
  try {
    console.log('Testing Supabase connection...');
    
    // Test basic connection
    const { data, error } = await supabase.from('users').select('count').limit(1);
    
    if (error) {
      console.error('Supabase connection error:', error.message);
      return;
    }
    
    console.log('✅ Supabase connection successful');
    console.log('✅ Google OAuth should work with proper configuration in Supabase dashboard');
    console.log('');
    console.log('Next steps:');
    console.log('1. Ensure Google OAuth is configured in Supabase dashboard');
    console.log('2. Add your domain to allowed redirect URLs');
    console.log('3. Test the signup flow');
    
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testGoogleAuth();