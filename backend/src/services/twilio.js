const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

async function makeCall(toNumber) {
  try {
    const call = await client.calls.create({
      to: toNumber,
      from: twilioNumber,
      twiml: '<Response><Say voice="alice">Hello! This is a test call from CallGenie. Your AI assistant is working!</Say></Response>'
    });
    return { success: true, sid: call.sid };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

module.exports = { makeCall }; 