import { defineConfig } from "vitest/config";

// On Windows, VS Code can open the project as "c:\..." while Node resolves "C:\...".
// Vitest then loads itself twice and every test fails, so normalise the drive letter.
const root = process.cwd().replace(/^[a-z]:/, (drive) => drive.toUpperCase());

export default defineConfig({
  root,
  test: {
    environment: "node",
    // The default "forks" pool can hang on exit on Windows; threads exit cleanly.
    pool: "threads",
    include: ["src/**/*.test.ts"],
  },
});
