export interface Question {
  text: string;
  options: string[];
  correctAnswer: any;
  points?: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  image: string;
  difficulty: "Easy" | "Med" | "Hard";
  questions: Question[];
  courseId?: string;
}

export const SEED_QUIZZES: Quiz[] = [
  {
    "id": "q1",
    "title": "React Architecture Fundamentals",
    "description": "Design systems, folder setups, state dividers, and components.",
    "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
    "difficulty": "Med",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q2",
    "title": "Cloud Computing Staging",
    "description": "Learn AWS provisioning, Azure setups, and staging environments.",
    "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
    "difficulty": "Easy",
    "courseId": "c3",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q3",
    "title": "JavaScript Closures & Scopes",
    "description": "Deep dive into lexical environments, closures, and contexts.",
    "image": "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400",
    "difficulty": "Hard",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q4",
    "title": "TypeScript Interface Matrices",
    "description": "Statically typing compound types, generics, and strict parameters.",
    "image": "https://images.unsplash.com/photo-1516116211223-5c359a36298a?w=400",
    "difficulty": "Med",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q5",
    "title": "Next.js Server Actions Protocol",
    "description": "Safe mutations, database actions, and client-side triggers.",
    "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    "difficulty": "Hard",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q6",
    "title": "Go Concurrency & Channels",
    "description": "Goroutines, mutexes, waitgroups, and stream pipelines.",
    "image": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400",
    "difficulty": "Hard",
    "courseId": "c2",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q7",
    "title": "Docker Container Pipelines",
    "description": "Dockerfiles, build layers, cache mounts, and images.",
    "image": "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400",
    "difficulty": "Easy",
    "courseId": "c3",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q8",
    "title": "Kubernetes Manifest Scaling",
    "description": "Deployments, service maps, ingresses, and secret grids.",
    "image": "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400",
    "difficulty": "Hard",
    "courseId": "c3",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q9",
    "title": "PostgreSQL Isolation Levels",
    "description": "Dirty reads, phantom records, and lock mechanisms.",
    "image": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
    "difficulty": "Hard",
    "courseId": "c2",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q10",
    "title": "CSS Flexbox & Grid Matrix",
    "description": "Laying out complex items, alignments, and custom values.",
    "image": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=400",
    "difficulty": "Easy",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q11",
    "title": "Git Workflow Rebase Loop",
    "description": "Squashing commits, cherry-picks, and clean branches.",
    "image": "https://images.unsplash.com/photo-1556075798-482a6a68539b?w=400",
    "difficulty": "Med",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q12",
    "title": "LLMOps Validation Pipelines",
    "description": "Evaluating model checkpoints, weights, and CUDA stacks.",
    "image": "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=400",
    "difficulty": "Hard",
    "courseId": "c2",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q13",
    "title": "Next.js Dynamic Routing Layers",
    "description": "Parallel routing, interceptors, and layouts mapping.",
    "image": "https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400",
    "difficulty": "Med",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q14",
    "title": "Web Security Headers Suite",
    "description": "CSP rules, CORS domains, HSTS policies, and cookies.",
    "image": "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400",
    "difficulty": "Hard",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q15",
    "title": "React State hooks performance",
    "description": "Avoid re-renders using useMemo, useCallback, and refs.",
    "image": "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400",
    "difficulty": "Med",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q16",
    "title": "Tailwind CSS Utility Design",
    "description": "Custom theme spacing, grid grids, and hover triggers.",
    "image": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
    "difficulty": "Easy",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q17",
    "title": "Redux Toolkit State Trees",
    "description": "Slices, dispatch pipelines, and synchronous adapters.",
    "image": "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=400",
    "difficulty": "Med",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q18",
    "title": "Next.js Middleware Gateways",
    "description": "Rewrites, redirects, headers, and token evaluation.",
    "image": "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400",
    "difficulty": "Hard",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q19",
    "title": "AWS Lambda Provisioning",
    "description": "Serverless setups, memory scales, and execution triggers.",
    "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
    "difficulty": "Med",
    "courseId": "c3",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q20",
    "title": "JWT Authentication Tokens",
    "description": "Secret signatures, payloads, and client token storage.",
    "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    "difficulty": "Easy",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  },
  {
    "id": "q21",
    "title": "REST vs GraphQL Endpoints",
    "description": "Overfetching resolutions, resolvers, schema definition.",
    "image": "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400",
    "difficulty": "Med",
    "courseId": "c1",
    "questions": [
      {
        "text": "What is the recommended approach for Next.js App Router route components?",
        "options": [
          "Store everything in route.ts",
          "Use colocated components or a dedicated src/components folder",
          "Place components inside public/"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword creates block scope in JS?",
        "options": [
          "var",
          "let/const",
          "function"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "How to declare an optional parameter in TS?",
        "options": [
          "param?",
          "param!",
          "param:optional"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "Where do Server Actions run?",
        "options": [
          "On the Client",
          "On the Server",
          "In the database"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which keyword launches a goroutine?",
        "options": [
          "run",
          "go",
          "launch"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What manages pod replicas in Kubernetes?",
        "options": [
          "Service",
          "ReplicaSet",
          "Ingress"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which level prevents phantom reads in SQL?",
        "options": [
          "Read Committed",
          "Serializable",
          "Repeatable Read"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "Which property centers items along flex direction?",
        "options": [
          "justify-content",
          "align-items",
          "display"
        ],
        "correctAnswer": 0,
        "points": 10
      },
      {
        "text": "How to apply commits on top of another branch?",
        "options": [
          "git merge",
          "git rebase",
          "git checkout"
        ],
        "correctAnswer": 1,
        "points": 10
      },
      {
        "text": "What does JWT stand for?",
        "options": [
          "JSON Web Token",
          "Java Wire Transfer",
          "Joint Web Term"
        ],
        "correctAnswer": 0,
        "points": 10
      }
    ]
  }
];
