const express = require('express');
const router = express.Router();
const Question = require('../models/Question');

// @route GET /quiz/:count
// @desc Get random questions
router.get('/:count', async (req, res) => {
  const count = parseInt(req.params.count);

  if (!count || isNaN(count) || count <= 0) {
    return res.status(400).json({ error: 'Invalid count parameter' });
  }

  try {
    const questions = await Question.aggregate([{ $sample: { size: count } }]);
    const formatted = questions.map(q => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options
    }));
    res.json(formatted);
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to get questions' });
  }
});

// @route POST /quiz/submit
// @desc Submit answers and calculate score
router.post('/submit', async (req, res) => {
  const { answers } = req.body; // format: [{ questionId, selectedIndex }]

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty answers array' });
  }

  try {
    const ids = answers.map(a => a.questionId);
    const questions = await Question.find({ _id: { $in: ids } });

    let score = 0;
    answers.forEach(ans => {
      const q = questions.find(q => q._id.toString() === ans.questionId);
      if (q && q.correctAnswerIndex === ans.selectedIndex) {
        score++;
      }
    });

    res.json({ score, total: answers.length });
  } catch (err) {
    console.error('Error evaluating answers:', err);
    res.status(500).json({ error: 'Failed to evaluate answers' });
  }
});

module.exports = router;
