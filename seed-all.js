const { PrismaClient } = require('./prisma/generated-client');
const db = new PrismaClient();

const SEED_QUIZZES = [
  { id: "q1", title: "React Architecture Fundamentals", description: "Design systems, folder setups, state dividers, and components.", courseId: "c1", questions: [{ text: "What is nextjs recommended folder structure?", options: ["Everything in route.ts", "Colocated in components folder", "Place in public/"], correctAnswer: 1 }] },
  { id: "q2", title: "Cloud Computing Staging", description: "Learn AWS provisioning, Azure setups, and staging environments.", courseId: "c3", questions: [{ text: "What does AWS stand for?", options: ["Amazon Web Services", "Alpha Web Software", "App Wire System"], correctAnswer: 0 }] },
  { id: "q3", title: "JavaScript Closures & Scopes", description: "Deep dive into lexical environments, closures, and contexts.", courseId: "c1", questions: [{ text: "Which keyword creates block scope?", options: ["var", "let/const", "function"], correctAnswer: 1 }] },
  { id: "q4", title: "TypeScript Interface Matrices", description: "Statically typing compound types, generics, and strict parameters.", courseId: "c1", questions: [{ text: "How to declare an optional parameter?", options: ["param?", "param!", "param:optional"], correctAnswer: 0 }] },
  { id: "q5", title: "Next.js Server Actions Protocol", description: "Safe mutations, database actions, and client-side triggers.", courseId: "c1", questions: [{ text: "Where do Server Actions run?", options: ["On the Client", "On the Server", "In the database"], correctAnswer: 1 }] },
].map(quiz => {
  while (quiz.questions.length < 10) {
    quiz.questions.push({ text: `Practice Question ${quiz.questions.length + 1} for ${quiz.title}`, options: ["Correct Answer", "Incorrect Answer 1", "Incorrect Answer 2", "Incorrect Answer 3"], correctAnswer: 0 });
  }
  return quiz;
});

async function main() {
  console.log("Seeding database...");

  // 1. Upsert Users
  await db.user.upsert({ where: { email: "instructor@learnup.com" }, update: { name: "Alex Rivera", role: "INSTRUCTOR", isVerified: true, password: "password123" }, create: { id: "inst-1", email: "instructor@learnup.com", name: "Alex Rivera", role: "INSTRUCTOR", isVerified: true, password: "password123" } });
  await db.user.upsert({ where: { email: "student@learnup.com" }, update: { name: "Anuj", role: "STUDENT", isVerified: true, password: "password123" }, create: { id: "std-1", email: "student@learnup.com", name: "Anuj", role: "STUDENT", isVerified: true, password: "password123" } });
  await db.user.upsert({ where: { email: "admin@learnup.com" }, update: { name: "Admin Lead", role: "ADMIN", isVerified: true, password: "password123" }, create: { id: "admin-1", email: "admin@learnup.com", name: "Admin Lead", role: "ADMIN", isVerified: true, password: "password123" } });
  console.log("✅ Users seeded");

  // 2. Wallets
  for (const [uid, bal] of [["std-1", 20000.0], ["inst-1", 0.0], ["admin-1", 0.0]]) {
    await db.wallet.upsert({ where: { userId: uid }, update: { balance: bal }, create: { userId: uid, balance: bal } });
  }
  console.log("✅ Wallets seeded");

  // 3. Courses
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
    { id: "c10", title: "Rust Systems Programming Foundations", description: "Ownership mechanics, memory layouts, smart pointers, and concurrency grids.", price: 2199, image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400" },
  ];
  const subjects = ["JavaScript", "Python", "TypeScript", "DevOps", "Database", "Security", "Web Dev", "CSS", "Next.js", "AI", "Cloud", "Git", "React", "State Management", "API Design", "Serverless"];
  const levels = ["Introduction", "Fundamentals", "Basics", "Essentials", "Quickstart", "Bootcamp", "Deep Dive", "101"];
  const allCourses = [...premiumCourses];
  for (let i = 11; i <= 42; i++) {
    const subj = subjects[(i - 11) % subjects.length];
    const lvl = levels[Math.floor((i - 11) / subjects.length) % levels.length];
    allCourses.push({ id: `c${i}`, title: `${lvl} to ${subj}`, description: `A complete comprehensive guide to learning the foundational principles of ${subj}.`, price: 0, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80" });
  }

  for (const c of allCourses) {
    await db.course.upsert({ where: { id: c.id }, update: { title: c.title, description: c.description, image: c.image, price: c.price, instructorId: "inst-1" }, create: { id: c.id, title: c.title, description: c.description, image: c.image, price: c.price, instructorId: "inst-1" } });
  }
  console.log(`✅ ${allCourses.length} courses seeded (10 premium + 32 free)`);

  // 4. Enroll student in c1, c2, c3
  for (const cid of ["c1", "c2", "c3"]) {
    await db.courseEnrollment.upsert({ where: { userId_courseId: { userId: "std-1", courseId: cid } }, update: {}, create: { userId: "std-1", courseId: cid } });
  }
  console.log("✅ Student enrolled in c1, c2, c3");

  // 5. Quizzes
  for (const quiz of SEED_QUIZZES) {
    await db.quiz.upsert({ where: { id: quiz.id }, update: { title: quiz.title, description: quiz.description, courseId: quiz.courseId, questions: quiz.questions }, create: { id: quiz.id, title: quiz.title, description: quiz.description, courseId: quiz.courseId, questions: quiz.questions } });
  }
  console.log("✅ Quizzes seeded");

  // 6. Seed sample notifications for student and instructor
  const now = new Date();
  const notifs = [
    { id: "notif-1", userId: "std-1", title: "Welcome to LearnUp!", message: "You have been enrolled in Advanced React Architecture.", type: "QUIZ_ANNOUNCEMENT", isRead: false, createdAt: new Date(now - 1000 * 60 * 10) },
    { id: "notif-2", userId: "std-1", title: "Certificate Ready", message: "Your certificate for Cloud Architecture is ready to download.", type: "CERTIFICATE_AWARDED", isRead: false, createdAt: new Date(now - 1000 * 60 * 60) },
    { id: "notif-3", userId: "inst-1", title: "New Enrollment", message: "A student enrolled in Advanced React Architecture.", type: "ENROLLMENT", isRead: false, createdAt: new Date(now - 1000 * 60 * 5) },
    { id: "notif-4", userId: "inst-1", title: "Quiz Submitted", message: "A student submitted React Architecture Fundamentals quiz.", type: "QUIZ_SUBMITTED", isRead: true, createdAt: new Date(now - 1000 * 60 * 30) },
  ];
  for (const n of notifs) {
    await db.notification.upsert({ where: { id: n.id }, update: {}, create: n });
  }
  console.log("✅ Notifications seeded");

  console.log("\n🎉 Database seeded successfully!");
  console.log("   student@learnup.com    / password123 (STUDENT)");
  console.log("   instructor@learnup.com / password123 (INSTRUCTOR)");
  console.log("   admin@learnup.com      / password123 (ADMIN)");
}

main()
  .catch(e => { console.error("❌ Seed failed:", e.message); process.exit(1); })
  .finally(() => db.$disconnect());
