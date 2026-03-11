export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number; // index of correct answer
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the time complexity of binary search on a sorted array of n elements?",
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"],
    correct: 1,
  },
  {
    id: 2,
    question: "Which data structure uses LIFO (Last In, First Out) ordering?",
    options: ["Queue", "Linked List", "Stack", "Heap"],
    correct: 2,
  },
  {
    id: 3,
    question: "In a TCP/IP network, which layer is responsible for end-to-end communication?",
    options: ["Network Layer", "Data Link Layer", "Transport Layer", "Application Layer"],
    correct: 2,
  },
  {
    id: 4,
    question: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    correct: 2,
  },
  {
    id: 5,
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Simple Query Language",
      "Structured Question Language",
      "System Query Logic",
    ],
    correct: 0,
  },
  {
    id: 6,
    question: "Which of the following is NOT a valid HTTP method?",
    options: ["GET", "POST", "FETCH", "DELETE"],
    correct: 2,
  },
  {
    id: 7,
    question: "What is the result of `2 << 3` in most programming languages?",
    options: ["6", "8", "16", "24"],
    correct: 2,
  },
  {
    id: 8,
    question: "In object-oriented programming, what is encapsulation?",
    options: [
      "Inheriting properties from a parent class",
      "Bundling data and methods that operate on that data within a single unit",
      "Overriding a method in a subclass",
      "Creating multiple forms of a method",
    ],
    correct: 1,
  },
  {
    id: 9,
    question: "Which data structure is typically used to implement a BFS (Breadth-First Search)?",
    options: ["Stack", "Queue", "Priority Queue", "Hash Map"],
    correct: 1,
  },
  {
    id: 10,
    question: "What is the primary purpose of the OSI model?",
    options: [
      "To define hardware standards for network equipment",
      "To provide a framework for network protocol design and communication",
      "To manage IP address allocation globally",
      "To encrypt network traffic",
    ],
    correct: 1,
  },
  {
    id: 11,
    question: "In a relational database, what does a foreign key do?",
    options: [
      "Uniquely identifies each record in a table",
      "Encrypts sensitive columns",
      "Establishes a link between data in two tables",
      "Indexes a column for faster lookup",
    ],
    correct: 2,
  },
  {
    id: 12,
    question: "What does the acronym RAM stand for?",
    options: [
      "Read Access Memory",
      "Random Access Memory",
      "Rapid Application Module",
      "Read And Modify",
    ],
    correct: 1,
  },
  {
    id: 13,
    question: "Which asymptotic notation describes the worst-case time complexity?",
    options: ["Θ (Theta)", "Ω (Omega)", "O (Big-O)", "o (little-o)"],
    correct: 2,
  },
  {
    id: 14,
    question: "In a min-heap, what is always true about the root node?",
    options: [
      "It is the largest element",
      "It is the median element",
      "It is the smallest element",
      "It has exactly two children",
    ],
    correct: 2,
  },
  {
    id: 15,
    question: "What is a deadlock in operating systems?",
    options: [
      "A process consuming 100% CPU",
      "A situation where two or more processes are blocked forever, each waiting for the other",
      "A memory leak caused by unreleased resources",
      "A race condition in multi-threaded code",
    ],
    correct: 1,
  },
  {
    id: 16,
    question: "Which protocol is used to assign IP addresses dynamically in a network?",
    options: ["DNS", "FTP", "DHCP", "ARP"],
    correct: 2,
  },
  {
    id: 17,
    question: "What is the output of `print(type([]))` in Python?",
    options: ["<class 'array'>", "<class 'list'>", "<class 'tuple'>", "<class 'dict'>"],
    correct: 1,
  },
  {
    id: 18,
    question: "In version control, what does `git rebase` do compared to `git merge`?",
    options: [
      "Rebase creates a new branch while merge combines branches",
      "Rebase rewrites commit history to create a linear sequence; merge preserves branch history",
      "They are identical operations with different names",
      "Rebase undoes commits while merge applies them",
    ],
    correct: 1,
  },
  {
    id: 19,
    question: "Which design pattern ensures a class has only one instance?",
    options: ["Factory", "Observer", "Singleton", "Decorator"],
    correct: 2,
  },
  {
    id: 20,
    question: "What is the maximum number of nodes in a binary tree of height h?",
    options: ["2h", "2h - 1", "2^(h+1) - 1", "h^2"],
    correct: 2,
  },
];

export function shuffleQuestions(questions: Question[]): Question[] {
  const shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
