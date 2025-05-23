'use client';
import { Header } from '@/payload-types';
import { RowLabelProps, useRowLabel } from '@payloadcms/ui';

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<NonNullable<Header['navItems']>[number]>();

  let label = 'Row';

  if (data?.data) {
    const rowNumber = data.rowNumber !== undefined ? data.rowNumber + 1 : '';

    if (data.data.type === 'link' && data.data.linkFields?.link?.label) {
      label = `Link ${rowNumber}: ${data.data.linkFields.link.label}`;
    } else if (data.data.type === 'group' && data.data.groupFields?.label) {
      label = `Group ${rowNumber}: ${data.data.groupFields.label}`;
    }
  }

  return <div>{label}</div>;
};
