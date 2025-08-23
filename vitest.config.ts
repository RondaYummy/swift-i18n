import { defineConfig, configDefaults } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "json-summary", "lcov"],
      exclude: [
        ...configDefaults.exclude,
        "src/types/**",
        "src/index.ts",
        "docs/**"
      ],
    },
  },
});
