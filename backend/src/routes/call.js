const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ success: true, route: 'call' });
});

module.exports = router;