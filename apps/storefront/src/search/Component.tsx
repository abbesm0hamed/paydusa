'use client';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import React, { useState, useEffect } from 'react';
import { useDebounce } from '@/utilities/useDebounce';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export const Search: React.FC = () => {
  const [value, setValue] = useState('');
  const router = useRouter();
  const t = useTranslations();

  const debouncedValue = useDebounce(value);

  useEffect(() => {
    router.push(`/search${debouncedValue ? `?q=${debouncedValue}` : ''}`);
  }, [debouncedValue, router]);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col gap-2"
      >
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value);
          }}
          placeholder={t('search')}
        />
        <button type="submit" className="sr-only">
          submit
        </button>
      </form>
    </div>
  );
};
