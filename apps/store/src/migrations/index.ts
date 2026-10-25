import * as migration_20250923_000738 from "./20250923_000738";
import * as migration_20250924_131937 from "./20250924_131937";
import * as migration_20260624_195826 from "./20260624_195826";
import * as migration_20261025_074821_sizes_to_variants from "./20261025_074821_sizes_to_variants";
import * as migration_20261025_075200_payload_v4_schema from "./20261025_075200_payload_v4_schema";

export const migrations = [
  {
    up: migration_20250923_000738.up,
    down: migration_20250923_000738.down,
    name: "20250923_000738",
  },
  {
    up: migration_20250924_131937.up,
    down: migration_20250924_131937.down,
    name: "20250924_131937",
  },
  {
    up: migration_20260624_195826.up,
    down: migration_20260624_195826.down,
    name: "20260624_195826",
  },
  {
    up: migration_20261025_074821_sizes_to_variants.up,
    down: migration_20261025_074821_sizes_to_variants.down,
    name: "20261025_074821_sizes_to_variants",
  },
  {
    up: migration_20261025_075200_payload_v4_schema.up,
    down: migration_20261025_075200_payload_v4_schema.down,
    name: "20261025_075200_payload_v4_schema",
  },
];
