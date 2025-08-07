const supabase = require('./src/services/config/supabase');

async function testPhoneAssignment() {
  console.log('Testing phone number assignment...');
  
  try {
    // Test creating a user with phone number
    const testUserId = 'test-user-' + Date.now();
    const testEmail = 'test@example.com';
    
    console.log('Creating test user...');
    const { data: user, error } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        email: testEmail,
        name: 'Test User',
        phone_number: '+918035316321'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      return;
    }

    console.log('User created successfully:', user);
    
    // Test fetching the phone number
    console.log('Fetching phone number...');
    const { data: fetchedUser, error: fetchError } = await supabase
      .from('users')
      .select('phone_number')
      .eq('id', testUserId)
      .single();

    if (fetchError) {
      console.error('Error fetching user:', fetchError);
      return;
    }

    console.log('Phone number fetched:', fetchedUser.phone_number);
    
    // Clean up test user
    console.log('Cleaning up test user...');
    await supabase
      .from('users')
      .delete()
      .eq('id', testUserId);
    
    console.log('Test completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testPhoneAssignment();