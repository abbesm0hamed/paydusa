export const toKebabCase = (string: string): string =>
  string
    ?.replaceAll(/([a-z])([A-Z])/g, "$1-$2")
    .replaceAll(/\s+/g, "-")
    .toLowerCase();
