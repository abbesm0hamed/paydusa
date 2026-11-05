import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";

export default defineConfig({
  env: core.env,
  extends: [core, next],
  ignorePatterns: [
    ...(core.ignorePatterns ?? []),
    // Vendor-mirrored agent skills + downloaded Next.js docs: upstream
    // artifacts whose reformatted/edited content breaks skills-lock hashes.
    ".agents/**",
    ".claude/**",
    ".next-docs/**",
  ],
  rules: {
    // The repo deliberately mixes file casing driven by frameworks:
    // Next.js special files (global-error.tsx, not-found.tsx) and
    // shadcn-generated components (dropdown-menu.tsx) are kebab-case,
    // PayloadCMS custom components are PascalCase by convention
    // (Component.tsx, RowLabel.tsx), and app utilities are camelCase
    // (useDebounce.ts). No single casing policy can hold; keep the
    // existing per-context conventions.
    "unicorn/filename-case": "off",
  },
});
