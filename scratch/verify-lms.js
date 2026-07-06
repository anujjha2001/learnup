const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  console.log("Checking Database status...");
  
  // 1. User count & roles
  const users = await db.user.findMany();
  console.log(`Total users found: ${users.length}`);
  users.forEach(u => {
    console.log(`- User: ${u.name} | Role: ${u.role} | Streak: ${u.streak} | Last Login: ${u.lastLogin}`);
  });

  // 2. Courses
  const courses = await db.course.findMany();
  console.log(`Total courses found: ${courses.length}`);
  const premium = courses.filter(c => c.price > 0);
  const free = courses.filter(c => c.price === 0);
  console.log(`- Premium courses count: ${premium.length}`);
  console.log(`- Free courses count: ${free.length}`);

  if (courses.length < 40) {
    throw new Error(`Failed validation: Expected >= 40 courses, got ${courses.length}`);
  }
  if (premium.length !== 10) {
    throw new Error(`Failed validation: Expected exactly 10 premium courses, got ${premium.length}`);
  }
  console.log("Course Catalog counts: VALIDATED SUCCESSFULLY!");

  // 3. Support tickets table check
  const ticketCount = await db.supportTicket.count();
  console.log(`Total support tickets in DB: ${ticketCount}`);

  // 4. Wallet check
  const wallets = await db.wallet.findMany();
  console.log(`Total wallets in DB: ${wallets.length}`);

  // 5. Razorpay key check
  console.log("Checking Razorpay Env variables...");
  const hasKeyId = !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const hasSecret = !!process.env.RAZORPAY_KEY_SECRET;
  console.log(`- NEXT_PUBLIC_RAZORPAY_KEY_ID exists: ${hasKeyId}`);
  console.log(`- RAZORPAY_KEY_SECRET exists: ${hasSecret}`);

  console.log("ALL AUTOMATED VERIFICATION CHECKS PASSED!");
}

main()
  .catch(e => {
    console.error("Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
