require('dotenv').config();
const { PrismaClient } = require('./prisma/generated-client');
const db = new PrismaClient();

async function main() {
  const courseCount = await db.course.count();
  console.log('Total courses in DB:', courseCount);

  const users = await db.user.findMany({
    where: { email: { in: ['student@learnup.com', 'instructor@learnup.com', 'admin@learnup.com'] } },
    select: { id: true, email: true, role: true }
  });
  console.log('Test users:', JSON.stringify(users, null, 2));

  if (courseCount === 0) {
    console.log('\n⚠️  No courses in DB — need to run seed!');
  }
}

main()
  .catch(e => console.error('Error:', e.message))
  .finally(() => db.$disconnect());
