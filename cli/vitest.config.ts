import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

// Tests run against the SDK's source, so they never need a built dist.
export default defineConfig({
  resolve: { alias: { '@okdata/sdk': fileURLToPath(new URL('../typescript/src/index.ts', import.meta.url)) } },
  test: { include: ['test/**/*.test.ts'], testTimeout: 20_000, hookTimeout: 60_000 },
});
