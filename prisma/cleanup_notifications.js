const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up notifications...");
  const deleteResult = await prisma.notification.deleteMany({});
  console.log(`Successfully deleted ${deleteResult.count} mixed-up notifications.`);
}

main()
  .catch(e => console.error("Notification cleanup failed:", e))
  .finally(async () => await prisma.$disconnect());
