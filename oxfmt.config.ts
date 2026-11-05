import config from "ultracite/oxfmt";

// Vendor-mirrored agent skills and downloaded docs are upstream artifacts;
// reformatting them breaks skills-lock.json hashes and upstream diffs.
config.ignorePatterns = [
  ...(config.ignorePatterns ?? []),
  ".agents/**",
  ".claude/**",
  ".next-docs/**",
];

export default config;
