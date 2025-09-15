import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

/**
 * Resolve paths consistently with TypeScript path mapping
 * Maps @/ aliases to actual file system paths
 */
export const resolvePath = {
  migrations: path.resolve(dirname, '../migrations'),
  components: path.resolve(dirname, '../components'),
  lib: path.resolve(dirname, '../lib'),
  modules: path.resolve(dirname, '../modules'),
  pages: path.resolve(dirname, '../pages'),
} as const;

export type PathKey = keyof typeof resolvePath;
