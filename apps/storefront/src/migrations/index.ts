import * as migration_20250525_215435 from './20250525_215435';
import * as migration_20250917_200150 from './20250917_200150';

export const migrations = [
  {
    up: migration_20250525_215435.up,
    down: migration_20250525_215435.down,
    name: '20250525_215435',
  },
  {
    up: migration_20250917_200150.up,
    down: migration_20250917_200150.down,
    name: '20250917_200150'
  },
];
