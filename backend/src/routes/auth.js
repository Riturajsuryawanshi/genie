const express = require('express');
const router = express.Router();

const supabase = require('../services/config/supabase');

router.get('/health', (req, res) => res.json({ success: true, route: 'auth' }));

// Helper function to assign phone number to user
async function assignPhoneNumber(userId) {
  try {
    // Always assign the specific number +918035316321
    const phoneNumber = '+918035316321';
    
    // Update user with the phone number
    const { data: user, error } = await supabase
      .from('users')
      .update({ phone_number: phoneNumber })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error assigning phone number:', error);
      return { success: false, error: error.message };
    }

    return { success: true, phone_number: phoneNumber };
  } catch (error) {
    console.error('Error in assignPhoneNumber:', error);
    return { success: false, error: error.message };
  }
}

// Helper function to get user's phone number
async function getUserPhoneNumber(userId) {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('phone_number')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return { success: false, error: 'User not found' };
    }

    return { success: true, phone_number: user.phone_number };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// POST /auth/onboard - onboard a new user (optimized for speed)
router.post('/onboard', async (req, res) => {
  try {
    const userId = req.body.userId || req.body.user_id;
    const email = req.body.email;
    const fullName = req.body.fullName || req.body.full_name || req.body.name || null;
    
    if (!userId || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID and email are required' 
      });
    }

    // Fast upsert with minimal data
    const { data: user, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: email,
        name: fullName,
        phone_number: '+918035316321',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id',
        ignoreDuplicates: false
      })
      .select('id, email, name, phone_number')
      .single();

    if (error) {
      console.error('Onboard error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to onboard user' 
      });
    }

    // Async operations for better performance
    setImmediate(async () => {
      try {
        // Initialize usage stats
        await supabase.from('usage_stats').upsert({
          user_id: userId,
          calls_made: 0,
          minutes_used: 0,
          ai_response_rate: 0,
          voicemails: 0
        }, { onConflict: 'user_id' });
        
        // Initialize plan
        await supabase.from('plans').upsert({
          user_id: userId,
          plan_name: 'Free',
          status: 'active',
          features: ['Basic AI Assistant', 'Voice Calls']
        }, { onConflict: 'user_id' });
      } catch (asyncError) {
        console.error('Async onboarding error:', asyncError);
      }
    });

    res.json({ 
      success: true, 
      message: 'User onboarded successfully',
      phone_number: '+918035316321',
      user: user
    });
  } catch (error) {
    console.error('Onboard error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal server error' 
    });
  }
});

// GET /auth/phone/:userId - return user's assigned phone number, assign if missing
router.get('/phone/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    let result = await getUserPhoneNumber(userId);
    if (result.success && result.phone_number) {
      return res.json({ success: true, phone_number: result.phone_number });
    }
    // If not found, assign the specific number
    result = await assignPhoneNumber(userId);
    if (result.success) {
      return res.json({ success: true, phone_number: result.phone_number });
    } else {
      res.status(404).json({ success: false, error: result.error || 'Phone number not found or could not be assigned' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// GET /auth/user/:userId - return user profile info
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, phone_number, created_at')
      .eq('id', userId)
      .single();
    if (error || !user) {
      return res.status(404).json({ success: false, error: error?.message || 'User not found' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// GET /auth/usage/:userId - return user usage stats
router.get('/usage/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data: usage, error } = await supabase
      .from('usage_stats')
      .select('calls_made, minutes_used, ai_response_rate, voicemails')
      .eq('user_id', userId)
      .single();
    if (error || !usage) {
      return res.status(404).json({ success: false, error: error?.message || 'Usage stats not found' });
    }
    res.json({ success: true, usage });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// GET /auth/activity/:userId - return user recent activity
router.get('/activity/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data: activity, error } = await supabase
      .from('activity_log')
      .select('id, type, description, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    if (error || !activity) {
      return res.status(404).json({ success: false, error: error?.message || 'Activity not found' });
    }
    res.json({ success: true, activity });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// GET /auth/plan/:userId - return user plan/subscription info
router.get('/plan/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data: plan, error } = await supabase
      .from('plans')
      .select('plan_name, renewal_date, status, features')
      .eq('user_id', userId)
      .single();
    if (error || !plan) {
      return res.status(404).json({ success: false, error: error?.message || 'Plan not found' });
    }
    res.json({ success: true, plan });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

module.exports = router;