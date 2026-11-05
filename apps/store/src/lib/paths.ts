import path from "node:path";
import { fileURLToPath } from "node:url";

// oxlint-disable-next-line unicorn/prefer-import-meta-properties -- Next.js does not provide import.meta.dirname at runtime.
const dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Resolve paths consistently with TypeScript path mapping
 * Maps @/ aliases to actual file system paths
 */
export const resolvePath = {
  components: path.resolve(dirname, "../components"),
  lib: path.resolve(dirname, "../lib"),
  migrations: path.resolve(dirname, "../migrations"),
  modules: path.resolve(dirname, "../modules"),
  pages: path.resolve(dirname, "../pages"),
} as const;

export type PathKey = keyof typeof resolvePath;
