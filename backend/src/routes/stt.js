const express = require('express');
const router = express.Router();
router.get('/health', (req, res) => res.json({ success: true, route: 'stt' }));
module.exports = router;