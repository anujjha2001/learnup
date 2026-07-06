const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: { learnupId: null }
  });

  for (const user of users) {
    const baseId = (user.name || user.email.split('@')[0]).toLowerCase().replace(/[^a-z0-9]/g, '');
    const learnupId = `@${baseId}_${Math.random().toString(36).substring(2, 6)}`;
    
    await prisma.user.update({
      where: { id: user.id },
      data: { learnupId }
    });
    console.log(`Updated user ${user.email} with learnupId: ${learnupId}`);
  }
  console.log("Done populating learnupIds.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
