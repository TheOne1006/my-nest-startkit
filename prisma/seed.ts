import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { generatePasswordHash } from '../src/users/utils/password.util';

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
// @ts-ignore
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@theone.io';
  const passwordRaw = 'admin';
  const { salt, hash: password } = await generatePasswordHash(passwordRaw);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      username: 'admin',
      password,
      salt,
      roles: ['admin', 'user'],
    },
  });

  console.log({ admin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
