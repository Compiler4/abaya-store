import { rm } from "node:fs/promises";
import path from "node:path";

const nextDirectory = path.join(process.cwd(), ".next");

await rm(nextDirectory, { recursive: true, force: true });

console.log("Cleared the Next.js build cache.");
