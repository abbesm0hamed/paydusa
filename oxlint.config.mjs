import { defineConfig } from "oxlint";

export default defineConfig({
  extends: [
    "ultracite/config/oxlint/core/index.mjs",
    "ultracite/config/oxlint/next/index.mjs",
  ],
});
