const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Question = require('../models/Question');

dotenv.config();

const sampleQuestions = [
  // --- Java Questions ---
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
    topic: "Java",
    questionText: "Which method is the entry point for a Java program?",
    options: ["start()", "main()", "run()", "init()"],
    correctAnswerIndex: 1
  },
  {
    topic: "Java",
    questionText: "Which of the following is used to create an object in Java?",
    options: ["create", "new", "alloc", "init"],
    correctAnswerIndex: 1
  },
  {
    topic: "Java",
    questionText: "Which of the following is not a primitive data type in Java?",
    options: ["int", "boolean", "String", "char"],
    correctAnswerIndex: 2
  },
  {
    topic: "Java",
    questionText: "What is the default value of a boolean variable in Java?",
    options: ["true", "false", "0", "null"],
    correctAnswerIndex: 1
  },
  {
    topic: "Java",
    questionText: "Which exception is thrown when a divide by zero occurs in Java?",
    options: ["IOException", "ArithmeticException", "NullPointerException", "NumberFormatException"],
    correctAnswerIndex: 1
  },

  // --- Python Questions ---
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
  },
  {
    topic: "Python",
    questionText: "Which of the following is used to create a list in Python?",
    options: ["()", "{}", "[]", "<>"],
    correctAnswerIndex: 2
  },
  {
    topic: "Python",
    questionText: "Which of the following is the correct way to write a for loop in Python?",
    options: ["for(i = 0; i < 10; i++)", "for i in range(10):", "foreach i in range(10):", "loop i from 0 to 10"],
    correctAnswerIndex: 1
  },
  {
    topic: "Python",
    questionText: "Which keyword is used to define a class in Python?",
    options: ["class", "define", "object", "struct"],
    correctAnswerIndex: 0
  },
  {
    topic: "Python",
    questionText: "Which function is used to get input from the user in Python?",
    options: ["get()", "input()", "scanf()", "read()"],
    correctAnswerIndex: 1
  },
  {
    topic: "Python",
    questionText: "What is the output of `bool('False')` in Python?",
    options: ["False", "True", "0", "Error"],
    correctAnswerIndex: 1
  }
];

async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Question.deleteMany(); // optional: clears previous data
    await Question.insertMany(sampleQuestions);
    console.log("✅ Sample questions inserted.");
    process.exit();
  } catch (err) {
    console.error("❌ Failed to insert:", err);
    process.exit(1);
  }
}

seedQuestions();
