import type { Field, GroupField } from "payload";

import deepMerge from "@/utilities/deepMerge";

export type LinkAppearances = "default" | "outline";

export const appearanceOptions: Record<
  LinkAppearances,
  { label: string; value: string }
> = {
  default: {
    label: "Default",
    value: "default",
  },
  outline: {
    label: "Outline",
    value: "outline",
  },
};

type LinkType = (options?: {
  appearances?: LinkAppearances[] | false;
  disableLabel?: boolean;
  overrides?: Partial<GroupField>;
}) => Field;

export const link: LinkType = ({
  appearances,
  disableLabel = false,
  overrides = {},
} = {}) => {
  const linkResult: GroupField = {
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        fields: [
          {
            admin: {
              layout: "horizontal",
              width: "50%",
            },
            defaultValue: "reference",
            name: "type",
            options: [
              {
                label: "Internal link",
                value: "reference",
              },
              {
                label: "Custom URL",
                value: "custom",
              },
            ],
            type: "radio",
          },
          {
            admin: {
              style: {
                alignSelf: "flex-end",
              },
              width: "50%",
            },
            label: "Open in new tab",
            name: "newTab",
            type: "checkbox",
          },
        ],
        type: "row",
      },
    ],
    name: "link",
    type: "group",
  };

  const linkTypes: Field[] = [
    {
      admin: {
        condition: (_, siblingData) => siblingData?.type === "reference",
      },
      label: "Document to link to",
      name: "reference",
      relationTo: ["pages", "posts"],
      required: true,
      type: "relationship",
    },
    {
      admin: {
        condition: (_, siblingData) => siblingData?.type === "custom",
      },
      label: "Custom URL",
      name: "url",
      required: true,
      type: "text",
    },
  ];

  if (disableLabel) {
    linkResult.fields = [...linkResult.fields, ...linkTypes];
  } else {
    linkTypes.map((linkType) => ({
      ...linkType,
      admin: {
        ...linkType.admin,
        width: "50%",
      },
    }));

    linkResult.fields.push({
      fields: [
        ...linkTypes,
        {
          admin: {
            width: "50%",
          },
          label: "Label",
          name: "label",
          required: true,
          type: "text",
        },
      ],
      type: "row",
    });
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [
      appearanceOptions.default,
      appearanceOptions.outline,
    ];

    if (appearances) {
      appearanceOptionsToUse = appearances.map(
        (appearance) => appearanceOptions[appearance]
      );
    }

    linkResult.fields.push({
      admin: {
        description: "Choose how the link should be rendered.",
      },
      defaultValue: "default",
      name: "appearance",
      options: appearanceOptionsToUse,
      type: "select",
    });
  }

  return deepMerge(linkResult, overrides);
};
