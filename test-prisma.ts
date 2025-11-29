import { prisma } from "./lib/prisma";

async function main() {
  console.log("Modelos disponibles en Prisma:");
  console.log(Object.keys(prisma));
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
