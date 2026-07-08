const { PrismaClient } = require('./generated-client');
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
].map(quiz => {
  while (quiz.questions.length < 10) {
    quiz.questions.push({
      text: `Practice Question ${quiz.questions.length + 1} for ${quiz.title}`,
      options: ["Correct Answer", "Incorrect Answer 1", "Incorrect Answer 2", "Incorrect Answer 3"],
      correctAnswer: 0
    });
  }
  return quiz;
});

async function main() {
  console.log("Seeding database...");

  // 1. Create Users
  const instructor = await db.user.upsert({
    where: { email: "instructor@learnup.com" },
    update: { id: "inst-1", name: "Alex Rivera", role: "INSTRUCTOR", isVerified: true, password: "password123" },
    create: {
      id: "inst-1",
      email: "instructor@learnup.com",
      name: "Alex Rivera",
      role: "INSTRUCTOR",
      isVerified: true,
      password: "password123"
    }
  });
  console.log("Instructor created:", instructor);

  const student = await db.user.upsert({
    where: { email: "student@learnup.com" },
    update: { id: "std-1", name: "Anuj", role: "STUDENT", isVerified: true, password: "password123" },
    create: {
      id: "std-1",
      email: "student@learnup.com",
      name: "Anuj",
      role: "STUDENT",
      isVerified: true,
      password: "password123"
    }
  });
  console.log("Student created:", student);

  const admin = await db.user.upsert({
    where: { email: "admin@learnup.com" },
    update: { id: "admin-1", name: "Admin Lead", role: "ADMIN", isVerified: true, password: "password123" },
    create: {
      id: "admin-1",
      email: "admin@learnup.com",
      name: "Admin Lead",
      role: "ADMIN",
      isVerified: true,
      password: "password123"
    }
  });
  console.log("Admin created:", admin);

  // Seed wallets for users
  await db.wallet.upsert({
    where: { userId: "std-1" },
    update: { balance: 20000.0 },
    create: { userId: "std-1", balance: 20000.0 }
  });
  await db.wallet.upsert({
    where: { userId: "inst-1" },
    update: {},
    create: { userId: "inst-1", balance: 0.0 }
  });
  await db.wallet.upsert({
    where: { userId: "admin-1" },
    update: {},
    create: { userId: "admin-1", balance: 0.0 }
  });
  console.log("Seeded wallets for seed users");

  // 2. Create Courses
  const premiumCourses = [
    { id: "c1", title: "Advanced React Architecture", description: "Design systems, folder setups, state dividers, and components.", price: 1499, image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80" },
    { id: "c2", title: "Machine Learning Operational Scaling", description: "Scale model training pipelines and deploy API endpoints.", price: 2999, image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=400&q=80" },
    { id: "c3", title: "Cloud Architecture & Kubernetes Grid", description: "AWS provisioning, cloud grids, container networks, and ingress scaling.", price: 3499, image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400" },
    { id: "c4", title: "Go Concurrency & Microservices", description: "Goroutines, channels, workers, mutexes, and gRPC scaling.", price: 1999, image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400" },
    { id: "c5", title: "Next.js Production SaaS Boilerplates", description: "Server actions, auth integrations, Stripe checkout, and database adapters.", price: 2499, image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=400" },
    { id: "c6", title: "PostgreSQL Performance Tuning", description: "Indexes, vacuuming, connection pool management, and query optimization.", price: 1299, image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400" },
    { id: "c7", title: "Docker Masterclass for DevOps", description: "Caching layers, multi-stage builds, rootless containers, and swarm.", price: 999, image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=400" },
    { id: "c8", title: "Full-Stack Security & Pentesting", description: "CORS, CSRF protection, sanitization, Rate limit configurations, and JWT safety.", price: 3999, image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400" },
    { id: "c9", title: "AI Agents with LangChain & Python", description: "Function calling, embeddings, semantic search vector stores, and custom chains.", price: 4999, image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400" },
    { id: "c10", title: "Rust Systems Programming Foundations", description: "Ownership mechanics, memory layouts, smart pointers, and concurrency grids.", price: 2199, image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400" }
  ];

  const subjects = ["JavaScript", "Python", "TypeScript", "DevOps", "Database", "Security", "Web Dev", "CSS", "Next.js", "AI", "Cloud", "Git", "React", "State Management", "API Design", "Serverless"];
  const levels = ["Introduction", "Fundamentals", "Basics", "Essentials", "Quickstart", "Bootcamp", "Deep Dive", "101"];

  const coursesToSeed = [...premiumCourses];

  for (let i = 11; i <= 42; i++) {
    const subj = subjects[(i - 11) % subjects.length];
    const lvl = levels[Math.floor((i - 11) / subjects.length) % levels.length];
    coursesToSeed.push({
      id: `c${i}`,
      title: `${lvl} to ${subj}`,
      description: `A complete comprehensive guide to learning the foundational principles of ${subj}. Learn via interactive modules.`,
      price: 0,
      image: `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80`
    });
  }

  for (const c of coursesToSeed) {
    await db.course.upsert({
      where: { id: c.id },
      update: {
        title: c.title,
        description: c.description,
        image: c.image,
        price: c.price,
        instructorId: "inst-1"
      },
      create: {
        id: c.id,
        title: c.title,
        description: c.description,
        image: c.image,
        price: c.price,
        instructorId: "inst-1"
      }
    });
  }
  console.log(`Successfully seeded ${coursesToSeed.length} courses (10 premium, 32 free).`);

  // Enroll student in a few courses (c1, c2, c3)
  for (const cid of ["c1", "c2", "c3"]) {
    await db.courseEnrollment.upsert({
      where: { userId_courseId: { userId: "std-1", courseId: cid } },
      update: {},
      create: { userId: "std-1", courseId: cid }
    });
  }
  console.log("Student enrolled in baseline courses.");

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
