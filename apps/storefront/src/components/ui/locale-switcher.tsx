'use client';

import { usePathname } from '@/i18n/routing';
import { useLocale } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { TypedLocale } from 'payload';
import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@repo/design-system/components/ui/select';
import { localization } from '@/i18n/localization';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const pathname = usePathname();

  function onSelectChange(value: TypedLocale) {
    startTransition(() => {
      const newPathname = pathname.startsWith(`/${locale}`)
        ? `/${value}${pathname.slice(locale.length + 1)}`
        : `/${value}${pathname}`;

      router.replace(newPathname);
    });
  }

  return (
    <Select onValueChange={onSelectChange} value={locale}>
      <SelectTrigger className="w-auto text-sm bg-transparent gap-2 pl-0 md:pl-3 border-none">
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {localization.locales
          .sort((a, b) => a.label.localeCompare(b.label)) // Ordenar por label
          .map((locale) => (
            <SelectItem value={locale.code} key={locale.code}>
              {locale.label}
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}
