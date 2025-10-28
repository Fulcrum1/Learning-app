import "dotenv/config";
import { defineConfig, env } from "prisma/config";
import * as path from "node:path";

export default defineConfig({
    engine: "classic",
    schema: path.join("prisma", "schema.prisma"),
    migrations: {
        path: path.join("prisma", "migrations"),
        seed: "ts-node -r tsconfig-paths/register prisma/seed.ts",
    },
    datasource: {
        url: env("DATABASE_URL"),
    },
});