import os from "node:os";
import { defineConfig } from "vitest/config";

const isCI = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
const cpuCount = os.cpus().length;
const e2eWorkers = isCI ? 2 : Math.min(4, Math.max(1, Math.floor(cpuCount * 0.25)));

export default defineConfig({
  test: {
    // E2E suites spin up real gateway servers and can legitimately take longer
    // than Vitest's default hook timeout (10s) on slower machines/CI.
    testTimeout: 120_000,
    hookTimeout: 120_000,
    pool: "forks",
    maxWorkers: e2eWorkers,
    include: ["test/**/*.e2e.test.ts", "src/**/*.e2e.test.ts"],
    setupFiles: ["test/setup.ts"],
    exclude: [
      "dist/**",
      "apps/macos/**",
      "apps/macos/.build/**",
      "**/vendor/**",
      "dist/OpenClaw.app/**",
    ],
  },
});
