import { chmodSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const directoryMode = 0o755;
const fileMode = 0o644;

const writableBuildEnv = {
  ...process.env,
  NODE_ENV: "production",
};

const knownDirectories = [
  ".",
  "prisma",
  "public",
  "scripts",
  "src",
  "src/app",
  "src/app/api",
  "src/app/api/admin",
  "src/app/api/admin/stats",
];

const knownFiles = [
  "next.config.mjs",
  "package.json",
  "package-lock.json",
  "postcss.config.mjs",
  "tsconfig.json",
  "prisma/schema.prisma",
  "src/app/api/admin/stats/route.ts",
];

function safeChmod(path, mode) {
  try {
    if (existsSync(path)) {
      chmodSync(path, mode);
    }
  } catch (error) {
    console.warn(`Warning: could not chmod ${path}: ${error.message}`);
  }
}

function normalizeTree(path) {
  let currentStat;

  try {
    currentStat = statSync(path);
  } catch {
    return;
  }

  if (currentStat.isDirectory()) {
    safeChmod(path, directoryMode);

    let entries;

    try {
      entries = readdirSync(path, { withFileTypes: true });
    } catch (error) {
      safeChmod(path, directoryMode);

      try {
        entries = readdirSync(path, { withFileTypes: true });
      } catch {
        console.warn(`Warning: could not read ${path}: ${error.message}`);
        return;
      }
    }

    for (const entry of entries) {
      if (
        entry.name === "node_modules" ||
        entry.name === ".next" ||
        entry.name === ".git" ||
        entry.name === ".vercel"
      ) {
        continue;
      }

      normalizeTree(join(path, entry.name));
    }

    return;
  }

  if (currentStat.isFile()) {
    safeChmod(path, fileMode);
  }
}

function run(label, args) {
  console.log(`\n> ${label}`);

  const result = spawnSync(process.execPath, args, {
    cwd: root,
    env: writableBuildEnv,
    stdio: "inherit",
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

for (const directory of knownDirectories) {
  safeChmod(resolve(root, directory), directoryMode);
}

for (const file of knownFiles) {
  safeChmod(resolve(root, file), fileMode);
}

normalizeTree(resolve(root, "src"));
normalizeTree(resolve(root, "prisma"));
normalizeTree(resolve(root, "public"));
normalizeTree(resolve(root, "scripts"));

run("prisma generate", ["node_modules/prisma/build/index.js", "generate"]);
run("next build", ["node_modules/next/dist/bin/next", "build"]);
