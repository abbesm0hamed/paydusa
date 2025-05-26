import * as migration_20250525_215435 from './20250525_215435';

export const migrations = [
  {
    up: migration_20250525_215435.up,
    down: migration_20250525_215435.down,
    name: '20250525_215435'
  },
];
