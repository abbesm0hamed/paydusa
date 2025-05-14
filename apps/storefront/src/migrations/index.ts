import * as migration_20250514_001028 from './20250514_001028';

export const migrations = [
  {
    up: migration_20250514_001028.up,
    down: migration_20250514_001028.down,
    name: '20250514_001028'
  },
];
