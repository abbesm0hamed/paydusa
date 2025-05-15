import { createServerFeature } from '@payloadcms/richtext-lexical';
import { LargeBodyNode } from '@/fields/richText/features/largeBody/LargeBodyNode';

export const LargeBodyFeature = createServerFeature({
  feature: {
    ClientFeature:
      '@/fields/richText/features/largeBody/client#LargeBodyFeatureClient',
    nodes: [
      {
        node: LargeBodyNode,
      },
    ],
  },
  key: 'largeBody',
});
