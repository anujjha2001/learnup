const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();

const SEED_QUIZZES = [
  { id: "q1", title: "React Architecture Fundamentals", description: "Design systems, folder setups, state dividers, and components.", courseId: "c1", difficulty: "Med", questions: [{ text: "What is nextjs recommended folder structure?", options: ["Everything in route.ts", "Colocated in components folder", "Place in public/"], correctAnswer: 1 }] },
  { id: "q2", title: "Cloud Computing Staging", description: "Learn AWS provisioning, Azure setups, and staging environments.", courseId: "c3", difficulty: "Easy", questions: [{ text: "What does AWS stand for?", options: ["Amazon Web Services", "Alpha Web Software", "App Wire System"], correctAnswer: 0 }] },
  { id: "q3", title: "JavaScript Closures & Scopes", description: "Deep dive into lexical environments, closures, and contexts.", courseId: "c1", difficulty: "Hard", questions: [{ text: "Which keyword creates block scope?", options: ["var", "let/const", "function"], correctAnswer: 1 }] },
  { id: "q4", title: "TypeScript Interface Matrices", description: "Statically typing compound types, generics, and strict parameters.", courseId: "c1", difficulty: "Med", questions: [{ text: "How to declare an optional parameter?", options: ["param?", "param!", "param:optional"], correctAnswer: 0 }] },
  { id: "q5", title: "Next.js Server Actions Protocol", description: "Safe mutations, database actions, and client-side triggers.", courseId: "c1", difficulty: "Hard", questions: [{ text: "Where do Server Actions run?", options: ["On the Client", "On the Server", "In the database"], correctAnswer: 1 }] },
  { id: "q6", title: "Go Concurrency & Channels", description: "Goroutines, mutexes, waitgroups, and stream pipelines.", courseId: "c2", difficulty: "Hard", questions: [{ text: "Which keyword launches a goroutine?", options: ["run", "go", "launch"], correctAnswer: 1 }] },
  { id: "q7", title: "Docker Container Pipelines", description: "Dockerfiles, build layers, cache mounts, and images.", courseId: "c3", difficulty: "Easy", questions: [{ text: "What command starts docker compose?", options: ["docker-compose up", "docker run", "docker start"], correctAnswer: 0 }] },
  { id: "q8", title: "Kubernetes Manifest Scaling", description: "Deployments, service maps, ingresses, and secret grids.", courseId: "c3", difficulty: "Hard", questions: [{ text: "What manages pod replicas in Kubernetes?", options: ["Service", "ReplicaSet", "Ingress"], correctAnswer: 1 }] },
  { id: "q9", title: "PostgreSQL Isolation Levels", description: "Dirty reads, phantom records, and lock mechanisms.", courseId: "c2", difficulty: "Hard", questions: [{ text: "Which level prevents phantom reads?", options: ["Read Committed", "Serializable", "Repeatable Read"], correctAnswer: 1 }] },
  { id: "q10", title: "CSS Flexbox & Grid Matrix", description: "Laying out complex items, alignments, and custom values.", courseId: "c1", difficulty: "Easy", questions: [{ text: "Which property centers items along flex direction?", options: ["justify-content", "align-items", "display"], correctAnswer: 0 }] },
  { id: "q11", title: "Git Workflow Rebase Loop", description: "Squashing commits, cherry-picks, and clean branches.", courseId: "c1", difficulty: "Med", questions: [{ text: "How to apply commits on top of another branch?", options: ["git merge", "git rebase", "git checkout"], correctAnswer: 1 }] },
  { id: "q12", title: "LLMOps Validation Pipelines", description: "Evaluating model checkpoints, weights, and CUDA stacks.", courseId: "c2", difficulty: "Hard", questions: [{ text: "What is ML model quantization?", options: ["Reducing parameter precision", "Increasing parameters", "Deleting weights"], correctAnswer: 0 }] },
  { id: "q13", title: "Next.js Dynamic Routing Layers", description: "Parallel routing, interceptors, and layouts mapping.", courseId: "c1", difficulty: "Med", questions: [{ text: "What file handles custom loading state?", options: ["page.tsx", "loading.tsx", "layout.tsx"], correctAnswer: 1 }] },
  { id: "q14", title: "Web Security Headers Suite", description: "CSP rules, CORS domains, HSTS policies, and cookies.", courseId: "c1", difficulty: "Hard", questions: [{ text: "What does CSP stand for?", options: ["Content Security Policy", "Client State Parameter", "Connection Secure Port"], correctAnswer: 0 }] },
  { id: "q15", title: "React State hooks performance", description: "Avoid re-renders using useMemo, useCallback, and refs.", courseId: "c1", difficulty: "Med", questions: [{ text: "Which hook stores mutable state without triggering renders?", options: ["useState", "useRef", "useEffect"], correctAnswer: 1 }] },
  { id: "q16", title: "Tailwind CSS Utility Design", description: "Custom theme spacing, grid grids, and hover triggers.", courseId: "c1", difficulty: "Easy", questions: [{ text: "What class adds display flex?", options: ["block", "flex", "grid"], correctAnswer: 1 }] },
  { id: "q17", title: "Redux Toolkit State Trees", description: "Slices, dispatch pipelines, and synchronous adapters.", courseId: "c1", difficulty: "Med", questions: [{ text: "What updates Redux state?", options: ["Actions", "Reducers", "Selectors"], correctAnswer: 1 }] },
  { id: "q18", title: "Next.js Middleware Gateways", description: "Rewrites, redirects, headers, and token evaluation.", courseId: "c1", difficulty: "Hard", questions: [{ text: "Where should middleware.ts be located?", options: ["In root or src/", "In app/api/", "In public/"], correctAnswer: 0 }] },
  { id: "q19", title: "AWS Lambda Provisioning", description: "Serverless setups, memory scales, and execution triggers.", courseId: "c3", difficulty: "Med", questions: [{ text: "What is Lambda's max timeout?", options: ["5 mins", "15 mins", "30 mins"], correctAnswer: 1 }] },
  { id: "q20", title: "JWT Authentication Tokens", description: "Secret signatures, payloads, and client token storage.", courseId: "c1", difficulty: "Easy", questions: [{ text: "What does JWT stand for?", options: ["JSON Web Token", "Java Wire Transfer", "Joint Web Term"], correctAnswer: 0 }] },
  { id: "q21", title: "REST vs GraphQL Endpoints", description: "Overfetching resolutions, resolvers, schema definition.", courseId: "c1", difficulty: "Med", questions: [{ text: "Which handles overfetching?", options: ["REST", "GraphQL", "SOAP"], correctAnswer: 1 }] }
];

async function main() {
  console.log("Seeding database...");

  // 1. Create Users
  const instructor = await db.user.upsert({
    where: { email: "instructor@learnup.com" },
    update: { id: "inst-1", name: "Alex Rivera", role: "INSTRUCTOR" },
    create: {
      id: "inst-1",
      email: "instructor@learnup.com",
      name: "Alex Rivera",
      role: "INSTRUCTOR"
    }
  });
  console.log("Instructor created:", instructor);

  const student = await db.user.upsert({
    where: { email: "student@learnup.com" },
    update: { id: "std-1", name: "Anuj", role: "STUDENT" },
    create: {
      id: "std-1",
      email: "student@learnup.com",
      name: "Anuj",
      role: "STUDENT"
    }
  });
  console.log("Student created:", student);

  // 2. Create Courses
  const c1 = await db.course.upsert({
    where: { id: "c1" },
    update: {
      title: "Advanced React Architecture",
      description: "Modular systems and performance optimization.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
      price: 49.99,
      instructorId: "inst-1"
    },
    create: {
      id: "c1",
      title: "Advanced React Architecture",
      description: "Modular systems and performance optimization.",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
      price: 49.99,
      instructorId: "inst-1"
    }
  });

  const c2 = await db.course.upsert({
    where: { id: "c2" },
    update: {
      title: "Machine Learning Operational Scaling",
      description: "Scale model training pipelines and deploy API endpoints.",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80",
      price: 89.99,
      instructorId: "inst-1"
    },
    create: {
      id: "c2",
      title: "Machine Learning Operational Scaling",
      description: "Scale model training pipelines and deploy API endpoints.",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80",
      price: 89.99,
      instructorId: "inst-1"
    }
  });

  const c3 = await db.course.upsert({
    where: { id: "c3" },
    update: {
      title: "Cloud Architecture & Kubernetes Grid",
      description: "AWS provisioning, cloud grids, container networks, and ingress scaling.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
      price: 99.99,
      instructorId: "inst-1"
    },
    create: {
      id: "c3",
      title: "Cloud Architecture & Kubernetes Grid",
      description: "AWS provisioning, cloud grids, container networks, and ingress scaling.",
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400",
      price: 99.99,
      instructorId: "inst-1"
    }
  });
  console.log("Courses seeded.");

  // Enroll student in all three courses
  await db.courseEnrollment.upsert({
    where: { userId_courseId: { userId: "std-1", courseId: "c1" } },
    update: {},
    create: { userId: "std-1", courseId: "c1" }
  });
  await db.courseEnrollment.upsert({
    where: { userId_courseId: { userId: "std-1", courseId: "c2" } },
    update: {},
    create: { userId: "std-1", courseId: "c2" }
  });
  await db.courseEnrollment.upsert({
    where: { userId_courseId: { userId: "std-1", courseId: "c3" } },
    update: {},
    create: { userId: "std-1", courseId: "c3" }
  });
  console.log("Student enrolled in courses.");

  // 3. Create Quizzes
  for (const quiz of SEED_QUIZZES) {
    await db.quiz.upsert({
      where: { id: quiz.id },
      update: {
        title: quiz.title,
        description: quiz.description,
        courseId: quiz.courseId,
        questions: quiz.questions
      },
      create: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        courseId: quiz.courseId,
        questions: quiz.questions
      }
    });
  }
  console.log("Quizzes seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
