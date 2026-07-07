require('dotenv').config();
const { PrismaClient } = require('./prisma/generated-client/index.js');
const prisma = new PrismaClient({ datasources: { db: { url: process.env.DIRECT_URL } } });
prisma.user.findFirst().then(console.log).catch(console.error).finally(() => prisma.$disconnect());
