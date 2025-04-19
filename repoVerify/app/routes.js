const express = require('express');
const router = express.Router();
const { analyzeRepo } = require('./repoAnalyzer');

// POST /analyze - analyze a GitHub repo for code quality in a specific language
router.post('/analyze', async (req, res) => {
  const { repo_url, language } = req.body;

  if (!repo_url || !language) {
    return res.status(400).json({ error: 'Both repo_url and language are required' });
  }

  try {
    const result = await analyzeRepo(repo_url, language);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
