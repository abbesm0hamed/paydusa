import "@/styles/globals.css";
import { createMetadata } from "@lib/seo/metadata";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
// import { getBaseURL } from '@lib/util/env';
import { notFound } from "next/navigation";
import type { TypedLocale } from "payload";

import { Header } from "@/globals/Header/DesktopNav/Component";
import { localization } from "@/i18n/localization";
import { getLocalizedMessages } from "@/i18n/request";
import { routing } from "@/i18n/routing";
import { Providers } from "@/providers";
import { InitTheme } from "@/providers/Theme/InitTheme";
import { getServerSideURL } from "@/utilities/getURL";
import { mergeOpenGraph } from "@/utilities/mergeOpenGraph";

type Args = {
  children: React.ReactNode;
  params: Promise<{
    locale: TypedLocale;
  }>;
};

// export const metadata: Metadata = {
//   metadataBase: new URL(getBaseURL()),
// };

export const instant = false;

export default async function RootLayout({ children, params }: Args) {
  const { locale } = (await params) ?? "en";
  const currentLocale = localization.locales.find((loc) => loc.code === locale);
  const direction = currentLocale?.rtl ? "rtl" : "ltr";

  if (!routing.locales.includes(locale as string)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
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
        <Providers>
          <NextIntlClientProvider messages={messages}>
            <Header locale={locale} />
            <main className="relative">{children}</main>
          </NextIntlClientProvider>
        </Providers>
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
      title: "ecommerce home page",
      description: "ecommerce landing page",
      url: new URL(getServerSideURL()),
      images: [],
    }),
    other: {
      "facebook-domain-verification": process.env.FACEBOOK_DOMAIN_VERIFICATION!,
    },
    ...dictionary.messages.metadata,
  });

  return rootMeta;
};

export function generateStaticParams() {
  const defaultRegion = process.env.NEXT_PUBLIC_DEFAULT_REGION || "tn";

  return routing.locales.map((locale) => ({
    locale,
    countryCode: defaultRegion,
  }));
}
