const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config();

const sampleQuestions = [
  {
    topic: "Python",
    questionText: "Which planet is known as the Red Planet?",
    options: ["Earth", "Venus", "Mars", "Jupiter"],
    correctAnswerIndex: 2
  },
  {
    topic: "Python",
    questionText: "What is the capital of Karnataka?",
    options: ["Mumbai", "Chennai", "Bangalore", "Hyderabad"],
    correctAnswerIndex: 2
  },
  // Java topic questions
  {
    topic: "Java",
    questionText: "What is the size of an int variable in Java?",
    options: ["8 bits", "16 bits", "32 bits", "64 bits"],
    correctAnswerIndex: 2
  },
  {
    topic: "Java",
    questionText: "Which of these is NOT a valid access modifier in Java?",
    options: ["public", "protected", "private", "friendly"],
    correctAnswerIndex: 3
  },
  {
    topic: "Java",
    questionText: "Which keyword is used to inherit a class in Java?",
    options: ["this", "super", "extends", "implements"],
    correctAnswerIndex: 2
  },
  {
    topic: "Java",
    questionText: "What will be the output of the following code?\n\nSystem.out.println(10 + 20 + \"30\");",
    options: ["3030", "102030", "3030", "30"],
    correctAnswerIndex: 0
  },
  {
    topic: "Java",
    questionText: "Which of the following is used to handle exceptions in Java?",
    options: ["try-catch", "if-else", "for loop", "switch-case"],
    correctAnswerIndex: 0
  },
  {
    topic: "Python",
    questionText: "Which of the following is the correct syntax to define a function in Python?",
    options: ["function myFunc():", "def myFunc():", "func myFunc():", "define myFunc():"],
    correctAnswerIndex: 1
  },
  {
    topic: "Python",
    questionText: "What data type is the object below?\n\n`[1, 2, 3, 4]`",
    options: ["List", "Tuple", "Dictionary", "Set"],
    correctAnswerIndex: 0
  },
  {
    topic: "Python",
    questionText: "How do you start a comment in Python?",
    options: ["// Comment", "# Comment", "/* Comment */", "<!-- Comment -->"],
    correctAnswerIndex: 1
  },
  {
    topic: "Python",
    questionText: "What is the output of `print(type(3 / 2))` in Python 3?",
    options: ["<class 'int'>", "<class 'float'>", "<class 'double'>", "<class 'long'>"],
    correctAnswerIndex: 1
  },
  {
    topic: "Python",
    questionText: "Which keyword is used to handle exceptions in Python?",
    options: ["catch", "except", "handle", "error"],
    correctAnswerIndex: 1
  }

];

async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Question.insertMany(sampleQuestions);
    console.log("✅ Sample questions inserted.");
    process.exit();
  } catch (err) {
    console.error("❌ Failed to insert:", err);
    process.exit(1);
  }
}

seedQuestions();
