const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import only GPT routes
const gptRoutes = require('./src/routes/gpt');
app.use('/api/gpt', gptRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server running', openai: !!process.env.OPENAI_API_KEY });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
});