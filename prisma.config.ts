import { defineConfig, env } from "prisma/config";
import "dotenv/config";

/**
 * Prisma 7 Configuration - Following Waffles pattern
 * @see https://www.prisma.io/docs/orm/reference/prisma-config-reference
 */
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
