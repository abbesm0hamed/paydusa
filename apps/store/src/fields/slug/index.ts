import type { CheckboxField, TextField } from "payload";

import { formatSlugHook } from "./formatSlug";

interface Overrides {
  slugOverrides?: Partial<TextField>;
  checkboxOverrides?: Partial<CheckboxField>;
}

type Slug = (
  fieldToUse?: string,
  overrides?: Overrides
) => [TextField, CheckboxField];

export const slugField: Slug = (fieldToUse = "title", overrides = {}) => {
  const { slugOverrides, checkboxOverrides } = overrides;

  const checkBoxField: CheckboxField = {
    admin: {
      hidden: true,
      position: "sidebar",
    },
    defaultValue: true,
    name: "slugLock",
    type: "checkbox",
    ...checkboxOverrides,
  };

  // @ts-expect-error - ts mismatch Partial<TextField> with TextField
  const slugField: TextField = {
    name: "slug",
    type: "text",
    index: true,
    label: "Slug",
    ...slugOverrides,
    hooks: {
      // Kept this in for hook or API based updates
      beforeValidate: [formatSlugHook(fieldToUse)],
    },
    admin: {
      position: "sidebar",
      ...slugOverrides?.admin,
      components: {
        Field: {
          clientProps: {
            checkboxFieldPath: checkBoxField.name,
            fieldToUse,
          },
          path: "@/fields/slug/SlugComponent#SlugComponent",
        },
      },
    },
  };

  return [slugField, checkBoxField];
};
