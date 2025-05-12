import { analytics } from '@repo/analytics/posthog/server';
import { flag } from 'flags/next';

export const createFlag = (key: string) =>
  flag({
    key,
    defaultValue: false,
    async decide() {
      const userId = String(Math.random());
      const isEnabled = await analytics.isFeatureEnabled(key, userId);

      return isEnabled ?? (this.defaultValue as boolean);
    },
  });
