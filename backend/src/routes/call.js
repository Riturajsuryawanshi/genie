const express = require('express');
const router = express.Router();
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const client = twilio(accountSid, authToken);

// POST /api/call - make a call using Twilio
router.post('/call', async (req, res) => {
  const { to } = req.body;
  if (!to) return res.status(400).json({ success: false, error: 'Missing destination number' });

  try {
    const call = await client.calls.create({
      to,
      from: twilioNumber,
      url: 'http://demo.twilio.com/docs/voice.xml' // Replace with your TwiML URL if needed
    });
    res.json({ success: true, sid: call.sid });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;