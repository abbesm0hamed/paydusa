import * as migration_20250923_000738 from './20250923_000738';
import * as migration_20250924_131937 from './20250924_131937';

export const migrations = [
  {
    up: migration_20250923_000738.up,
    down: migration_20250923_000738.down,
    name: '20250923_000738',
  },
  {
    up: migration_20250924_131937.up,
    down: migration_20250924_131937.down,
    name: '20250924_131937'
  },
];
