const express = require('express');
const router = express.Router();

const supabase = require('../services/config/supabase');

router.get('/health', (req, res) => res.json({ success: true, route: 'auth' }));

// POST /auth/onboard - onboard a new user
router.post('/onboard', async (req, res) => {
  try {
    // Accept both user_id and userId, and full_name or name
    const userId = req.body.userId || req.body.user_id;
    const email = req.body.email;
    const fullName = req.body.fullName || req.body.full_name || req.body.name || null;
    
    if (!userId || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID and email are required' 
      });
    }

    // Create or update user in database
    const { data: user, error } = await supabase
      .from('users')
      .upsert({
        id: userId,
        email: email,
        name: fullName,
        account_status: 'active',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (error) {
      console.error('Onboard error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to onboard user' 
      });
    }

    res.json({ 
      success: true, 
      message: 'User onboarded successfully',
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

<<<<<<< HEAD

=======
// POST /auth/confirm - programmatically confirm a user's email
router.post('/confirm', async (req, res) => {
  const { user_id } = req.body;
  if (!user_id) {
    return res.status(400).json({ success: false, error: 'user_id is required' });
  }
  try {
    // Directly update the auth.users table to set email_confirmed_at to now()
    const { error } = await supabase.rpc('auth.confirm_user_email', { confirm_user_id: user_id });
    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
    res.json({ success: true, message: 'User confirmed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Failed to confirm user' });
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
    // If not found, assign a number
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
>>>>>>> e1801927d793f0b28aff106328f74bf9b730f52a

// GET /auth/user/:userId - return user profile info
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, account_status, trial_expires_at, created_at')
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