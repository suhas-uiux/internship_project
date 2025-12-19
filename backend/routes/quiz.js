const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// @route GET /quiz?count=5&topic=Java
router.get("/", async (req, res) => {
  const count = parseInt(req.query.count);
  const topic = req.query.topic;

  if (!count || isNaN(count) || count <= 0) {
    return res.status(400).json({ error: "Invalid count parameter" });
  }

  try {
    const filter = topic
      ? { topic: { $regex: new RegExp(`^${topic}$`, "i") } }
      : {};

    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: count } },
    ]);

    const formatted = questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      options: q.options,
    }));

    res.json({ questions: formatted }); // ✅ consistent format
  } catch (err) {
    console.error("Error fetching questions:", err);
    res.status(500).json({ error: "Failed to get questions" });
  }
});

// @route POST /quiz/submit
router.post("/submit", async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: "Invalid or empty answers array" });
  }

  try {
    const ids = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: ids } });

    let score = 0;
    answers.forEach((ans) => {
      const q = questions.find((q) => q._id.toString() === ans.questionId);
      if (q && q.correctAnswerIndex === ans.selectedIndex) {
        score++;
      }
    });

    res.json({ score, total: answers.length });
  } catch (err) {
    console.error("Error evaluating answers:", err);
    res.status(500).json({ error: "Failed to evaluate answers" });
  }
});

module.exports = router;
