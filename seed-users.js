const { PrismaClient } = require('./prisma/generated-client');
const db = new PrismaClient();

async function main() {
  console.log("Upserting test users...");

  // Student
  const student = await db.user.upsert({
    where: { email: "student@learnup.com" },
    update: { name: "Anuj", role: "STUDENT", isVerified: true, password: "password123" },
    create: {
      id: "std-1",
      email: "student@learnup.com",
      name: "Anuj",
      role: "STUDENT",
      isVerified: true,
      password: "password123"
    }
  });
  console.log("✅ Student:", student.email, "| role:", student.role);

  // Instructor
  const instructor = await db.user.upsert({
    where: { email: "instructor@learnup.com" },
    update: { name: "Alex Rivera", role: "INSTRUCTOR", isVerified: true, password: "password123" },
    create: {
      id: "inst-1",
      email: "instructor@learnup.com",
      name: "Alex Rivera",
      role: "INSTRUCTOR",
      isVerified: true,
      password: "password123"
    }
  });
  console.log("✅ Instructor:", instructor.email, "| role:", instructor.role);

  // Admin
  const admin = await db.user.upsert({
    where: { email: "admin@learnup.com" },
    update: { name: "Admin Lead", role: "ADMIN", isVerified: true, password: "password123" },
    create: {
      id: "admin-1",
      email: "admin@learnup.com",
      name: "Admin Lead",
      role: "ADMIN",
      isVerified: true,
      password: "password123"
    }
  });
  console.log("✅ Admin:", admin.email, "| role:", admin.role);

  // Wallets
  for (const uid of ["std-1", "inst-1", "admin-1"]) {
    await db.wallet.upsert({
      where: { userId: uid },
      update: {},
      create: { userId: uid, balance: uid === "std-1" ? 20000.0 : 0.0 }
    });
  }
  console.log("✅ Wallets seeded.");
  console.log("\nAll test accounts ready:");
  console.log("  student@learnup.com    / password123  (STUDENT)");
  console.log("  instructor@learnup.com / password123  (INSTRUCTOR)");
  console.log("  admin@learnup.com      / password123  (ADMIN)");
}

main()
  .catch((e) => { console.error("❌ Error:", e.message); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
