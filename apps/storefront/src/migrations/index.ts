import * as migration_20250514_001028 from './20250514_001028';
import * as migration_20250520_214613 from './20250520_214613';

export const migrations = [
  {
    up: migration_20250514_001028.up,
    down: migration_20250514_001028.down,
    name: '20250514_001028',
  },
  {
    up: migration_20250520_214613.up,
    down: migration_20250520_214613.down,
    name: '20250520_214613'
  },
];
