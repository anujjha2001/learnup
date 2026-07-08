const { PrismaClient } = require('./prisma/generated-client');
const db = new PrismaClient();

async function main() {
  try {
    const user = await db.user.findFirst();
    console.log('DB OK, first user:', user ? user.email : 'none (empty table)');
  } catch (e) {
    console.error('DB ERROR:', e.message);
    console.error('Full error:', e);
  } finally {
    await db.$disconnect();
  }
}

main();
