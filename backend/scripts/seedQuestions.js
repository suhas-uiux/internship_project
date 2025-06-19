const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); 
const Question = require('../models/Question');

dotenv.config();

const sampleQuestions = [
 {
  topic: "DBMS",
  questionText: "Which of the following is a valid SQL statement to retrieve all records from a table named 'students'?",
  options: ["GET * FROM students;", "SELECT * FROM students;", "FETCH ALL students;", "RETRIEVE * FROM students;"],
  correctAnswerIndex: 1
},
{
  topic: "DBMS",
  questionText: "Which of these is a property of transactions in a database?",
  options: ["Atomicity", "Anonymity", "Analyticity", "Authenticity"],
  correctAnswerIndex: 0
},
{
  topic: "DBMS",
  questionText: "What is a foreign key?",
  options: [
    "A key that uniquely identifies rows within the same table",
    "A key used to encrypt data",
    "A key that is a primary key in another table",
    "A key that refers to a foreign database"
  ],
  correctAnswerIndex: 2
},
{
  topic: "DBMS",
  questionText: "Which normal form removes transitive dependency?",
  options: ["1NF", "2NF", "3NF", "BCNF"],
  correctAnswerIndex: 2
},
{
  topic: "DBMS",
  questionText: "Which command is used to remove a table from a database?",
  options: ["DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "CLEAR TABLE"],
  correctAnswerIndex: 2
}
,
{
  topic: "OS",
  questionText: "Which of the following is not a function of the Operating System?",
  options: ["Memory Management", "File Management", "Data Mining", "Process Scheduling"],
  correctAnswerIndex: 2
},
{
  topic: "OS",
  questionText: "Which of these is a non-preemptive scheduling algorithm?",
  options: ["Round Robin", "Shortest Job Next", "Priority Scheduling", "FCFS"],
  correctAnswerIndex: 3
},
{
  topic: "OS",
  questionText: "What is the purpose of a system call?",
  options: ["To format the disk", "To communicate between devices", "To request service from the OS", "To run Java programs"],
  correctAnswerIndex: 2
},
{
  topic: "OS",
  questionText: "What is a critical section?",
  options: [
    "A part of code that must be executed by multiple processes",
    "A shared memory location",
    "A segment where shared resources are accessed",
    "A protected kernel routine"
  ],
  correctAnswerIndex: 2
},
{
  topic: "OS",
  questionText: "Which of the following is a deadlock avoidance algorithm?",
  options: ["Round Robin", "FIFO", "Banker’s Algorithm", "LRU"],
  correctAnswerIndex: 2
}
,
{
  topic: "Data Structures",
  questionText: "Which data structure uses FIFO (First In First Out)?",
  options: ["Stack", "Queue", "Tree", "Graph"],
  correctAnswerIndex: 1
},
{
  topic: "Data Structures",
  questionText: "What is the worst-case time complexity for searching in a binary search tree (unbalanced)?",
  options: ["O(log n)", "O(n)", "O(n log n)", "O(1)"],
  correctAnswerIndex: 1
},
{
  topic: "Data Structures",
  questionText: "Which of these is a self-balancing binary search tree?",
  options: ["AVL Tree", "Heap", "Trie", "BFS Tree"],
  correctAnswerIndex: 0
},
{
  topic: "Data Structures",
  questionText: "Which data structure is best suited for implementing recursion?",
  options: ["Queue", "Stack", "Array", "Linked List"],
  correctAnswerIndex: 1
},
{
  topic: "Data Structures",
  questionText: "In a max-heap, the largest element is at:",
  options: ["Leaf node", "Middle level", "Root", "Random position"],
  correctAnswerIndex: 2
}
,
{
  topic: "C",
  questionText: "Which header file is required to use `printf()` function in C?",
  options: ["conio.h", "math.h", "stdio.h", "string.h"],
  correctAnswerIndex: 2
},
{
  topic: "C",
  questionText: "What is the output of `printf(\"%d\", 5 + 2 * 3);`?",
  options: ["21", "11", "13", "15"],
  correctAnswerIndex: 1
},
{
  topic: "C",
  questionText: "Which of the following is not a valid C data type?",
  options: ["float", "real", "int", "char"],
  correctAnswerIndex: 1
},
{
  topic: "C",
  questionText: "Which of the following is used to allocate memory dynamically in C?",
  options: ["malloc", "calloc", "realloc", "All of the above"],
  correctAnswerIndex: 3
},
{
  topic: "C",
  questionText: "Which symbol is used to declare a pointer in C?",
  options: ["&", "*", "#", "%"],
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