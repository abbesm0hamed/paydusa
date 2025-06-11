import '@/styles/globals.css';
import type { Metadata } from 'next';
import type { TypedLocale } from 'payload';
// import { getBaseURL } from '@lib/util/env';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { draftMode } from 'next/headers';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { createMetadata } from '@repo/seo/metadata';
import { localization } from '@/i18n/localization';
import { InitTheme } from '@/providers/Theme/InitTheme';
import { cn } from '@/utilities/ui';
import { routing } from '@/i18n/routing';
import { Footer } from '@/globals/Footer/Component';
import { Header } from '@/globals/Header/DesktopNav/Component';
import { AdminBar } from '@/components/AdminBar';
import { mulish, spaceGrotesk, bytesized } from '@repo/design-system/lib/fonts';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { getLocalizedMessages } from '@/i18n/request';
import { getServerSideURL } from '@/utilities/getURL';
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph';

type Args = {
  children: React.ReactNode;
  params: Promise<{
    locale: TypedLocale;
  }>;
};

// export const metadata: Metadata = {
//   metadataBase: new URL(getBaseURL()),
// };

export default async function RootLayout({ children, params }: Args) {
  const { locale } = (await params) ?? 'en';
  const currentLocale = localization.locales.find((loc) => loc.code === locale);
  const direction = currentLocale?.rtl ? 'rtl' : 'ltr';

  if (!routing.locales.includes(locale as string)) {
    notFound();
  }
  setRequestLocale(locale);

  const { isEnabled } = await draftMode();
  const messages = await getMessages();

  return (
    <html
      className={cn(
        mulish.variable,
        spaceGrotesk.variable,
        bytesized.variable,
        GeistSans.variable,
        GeistMono.variable
      )}
      data-mode="light"
      lang={locale}
      dir={direction}
      suppressHydrationWarning
    >
      <head>
        <InitTheme />
        <link href="/favicon/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon/favicon.svg" rel="icon" type="image/svg+xml" />
        <link href="/favicon/apple-touch-icon.png" rel="apple-touch-icon" />
        <link
          href="/favicon/favicon-96x96.png"
          rel="icon"
          type="image/png"
          sizes="96x96"
        />
      </head>
      <body className="font-default">
        <NextIntlClientProvider messages={messages}>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />
          <Header locale={locale} />
          <main className="relative">{children}</main>
          <Footer locale={locale} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

type HomeProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateMetadata = async ({
  params,
}: HomeProps): Promise<Metadata> => {
  const { locale } = await params;
  const dictionary = await getLocalizedMessages(locale);

  const rootMeta = createMetadata({
    metadataBase: new URL(getServerSideURL()),
    openGraph: mergeOpenGraph({
      title: 'ecommerce home page',
      description: 'ecommerce landing page',
      url: new URL(getServerSideURL()),
      images: [],
    }),
    other: {
      'facebook-domain-verification': process.env.FACEBOOK_DOMAIN_VERIFICATION!,
    },
    ...dictionary.messages.metadata,
  });

  return rootMeta;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
