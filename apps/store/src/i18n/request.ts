import { getRequestConfig } from "next-intl/server";

import en from "./messages/en.json";
import { routing } from "./routing";

type Messages = typeof en;

declare global {
  // Use type safe message env with `next-intl`
  interface IntlMessages extends Messages {}
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});

export async function getLocalizedMessages(locale: string) {
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
}
