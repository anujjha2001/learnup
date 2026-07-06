const fs = require('fs');
const path = require('path');

const seedJsPath = path.join(__dirname, '../prisma/seed.js');
let seedContent = fs.readFileSync(seedJsPath, 'utf8');

// We will inject a helper function inside seed.js right before SEED_QUIZZES
// Or we can just use a regex to replace SEED_QUIZZES entirely.
// Since seed.js is a bit long, let's just generate the 21 quizzes with 10 questions each and replace the text.

const courses = ["c1", "c2", "c3"];
const generateQuestions = (topic) => {
  const q = [];
  for(let i = 1; i <= 10; i++) {
    q.push({
      text: `Question ${i} about ${topic}?`,
      options: [`Option A for Q${i}`, `Option B for Q${i}`, `Option C for Q${i}`, `Option D for Q${i}`],
      correctAnswer: i % 4
    });
  }
  return q;
};

const SEED_QUIZZES = [
  { id: "q1", title: "React Architecture Fundamentals", description: "Design systems, folder setups, state dividers, and components.", courseId: "c1", difficulty: "Med", questions: generateQuestions("React Architecture") },
  { id: "q2", title: "Cloud Computing Staging", description: "Learn AWS provisioning, Azure setups, and staging environments.", courseId: "c3", difficulty: "Easy", questions: generateQuestions("Cloud Computing") },
  { id: "q3", title: "JavaScript Closures & Scopes", description: "Deep dive into lexical environments, closures, and contexts.", courseId: "c1", difficulty: "Hard", questions: generateQuestions("JavaScript Closures") },
  { id: "q4", title: "TypeScript Interface Matrices", description: "Statically typing compound types, generics, and strict parameters.", courseId: "c1", difficulty: "Med", questions: generateQuestions("TypeScript Interfaces") },
  { id: "q5", title: "Next.js Server Actions Protocol", description: "Safe mutations, database actions, and client-side triggers.", courseId: "c1", difficulty: "Hard", questions: generateQuestions("Next.js Server Actions") },
  { id: "q6", title: "Go Concurrency & Channels", description: "Goroutines, mutexes, waitgroups, and stream pipelines.", courseId: "c2", difficulty: "Hard", questions: generateQuestions("Go Concurrency") },
  { id: "q7", title: "Docker Container Pipelines", description: "Dockerfiles, build layers, cache mounts, and images.", courseId: "c3", difficulty: "Easy", questions: generateQuestions("Docker Pipelines") },
  { id: "q8", title: "Kubernetes Manifest Scaling", description: "Deployments, service maps, ingresses, and secret grids.", courseId: "c3", difficulty: "Hard", questions: generateQuestions("Kubernetes Manifests") },
  { id: "q9", title: "PostgreSQL Isolation Levels", description: "Dirty reads, phantom records, and lock mechanisms.", courseId: "c2", difficulty: "Hard", questions: generateQuestions("PostgreSQL Isolation") },
  { id: "q10", title: "CSS Flexbox & Grid Matrix", description: "Laying out complex items, alignments, and custom values.", courseId: "c1", difficulty: "Easy", questions: generateQuestions("CSS Flexbox") },
  { id: "q11", title: "Git Workflow Rebase Loop", description: "Squashing commits, cherry-picks, and clean branches.", courseId: "c1", difficulty: "Med", questions: generateQuestions("Git Workflow") },
  { id: "q12", title: "LLMOps Validation Pipelines", description: "Evaluating model checkpoints, weights, and CUDA stacks.", courseId: "c2", difficulty: "Hard", questions: generateQuestions("LLMOps Validation") },
  { id: "q13", title: "Next.js Dynamic Routing Layers", description: "Parallel routing, interceptors, and layouts mapping.", courseId: "c1", difficulty: "Med", questions: generateQuestions("Dynamic Routing") },
  { id: "q14", title: "Web Security Headers Suite", description: "CSP rules, CORS domains, HSTS policies, and cookies.", courseId: "c1", difficulty: "Hard", questions: generateQuestions("Web Security") },
  { id: "q15", title: "React State hooks performance", description: "Avoid re-renders using useMemo, useCallback, and refs.", courseId: "c1", difficulty: "Med", questions: generateQuestions("React State Hooks") },
  { id: "q16", title: "Tailwind CSS Utility Design", description: "Custom theme spacing, grid grids, and hover triggers.", courseId: "c1", difficulty: "Easy", questions: generateQuestions("Tailwind CSS") },
  { id: "q17", title: "Redux Toolkit State Trees", description: "Slices, dispatch pipelines, and synchronous adapters.", courseId: "c1", difficulty: "Med", questions: generateQuestions("Redux Toolkit") },
  { id: "q18", title: "Next.js Middleware Gateways", description: "Rewrites, redirects, headers, and token evaluation.", courseId: "c1", difficulty: "Hard", questions: generateQuestions("Next.js Middleware") },
  { id: "q19", title: "AWS Lambda Provisioning", description: "Serverless setups, memory scales, and execution triggers.", courseId: "c3", difficulty: "Med", questions: generateQuestions("AWS Lambda") },
  { id: "q20", title: "JWT Authentication Tokens", description: "Secret signatures, payloads, and client token storage.", courseId: "c1", difficulty: "Easy", questions: generateQuestions("JWT Auth") },
  { id: "q21", title: "REST vs GraphQL Endpoints", description: "Overfetching resolutions, resolvers, schema definition.", courseId: "c1", difficulty: "Med", questions: generateQuestions("REST vs GraphQL") }
];

const newSeedQuizzesStr = `const SEED_QUIZZES = ${JSON.stringify(SEED_QUIZZES, null, 2)};`;

// Find everything from const SEED_QUIZZES = [ to ];\n\nasync function main()
const regex = /const SEED_QUIZZES = \[\s*\{[\s\S]*?\];\n*(?=async function main)/;
seedContent = seedContent.replace(regex, newSeedQuizzesStr + '\n\n');

fs.writeFileSync(seedJsPath, seedContent, 'utf8');
console.log('Updated seed.js with 10 questions per quiz.');
