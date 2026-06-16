import { config } from "dotenv";
import { resolve } from "path";
import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const envFile = process.env.SEED_ENV_FILE ?? ".env.production.local";
config({ path: resolve(process.cwd(), envFile), override: true });

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("caio123", 12);
  const user = await prisma.user.upsert({
    where: { email: "caio.devani@donaangela.com.br" },
    update: { name: "Caio Devani", role: Role.USER, passwordHash },
    create: {
      email: "caio.devani@donaangela.com.br",
      name: "Caio Devani",
      passwordHash,
      role: Role.USER,
    },
  });

  console.log(`OK — ${user.name} (${user.email}) role=${user.role}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
