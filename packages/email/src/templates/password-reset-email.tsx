import type { ReactElement } from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
  pixelBasedPreset,
} from "react-email";

const emailTheme = {
  presets: [pixelBasedPreset],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        border: "#e5e7eb",
        foreground: "#1a1a1a",
        muted: { DEFAULT: "#f7f7f7", foreground: "#737373" },
        primary: { DEFAULT: "#1a1a1a", foreground: "#fbfbfb" },
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
} as const;

type PasswordResetEmailProps = {
  reset_url: string;
  email?: string;
};

function PasswordResetEmailComponent({
  reset_url,
  email,
}: PasswordResetEmailProps): ReactElement {
  return (
    <Tailwind config={emailTheme}>
      <Html lang="en">
        <Head />
        <Preview>Reset your password</Preview>
        <Body className="bg-muted font-sans py-10">
          <Container className="bg-background border border-border rounded-[19px] mx-auto max-w-[520px] overflow-hidden">
            {/* Header */}
            <Section className="bg-primary px-10 py-6">
              <Text className="text-primary-foreground text-base font-bold tracking-tight m-0">
                Medusa Store
              </Text>
            </Section>

            {/* Main content */}
            <Section className="px-10 pt-10 pb-8">
              <Text className="inline-block bg-muted border border-border rounded-full text-muted-foreground text-[11px] font-semibold uppercase tracking-widest px-3 py-1 m-0 mb-6">
                Password Reset
              </Text>

              <Heading
                as="h1"
                className="text-foreground text-2xl font-bold tracking-tight leading-snug m-0 mb-3"
              >
                Reset Your Password
              </Heading>

              <Text className="text-muted-foreground text-sm leading-6 m-0 mb-6">
                Hello{email ? ` ${email}` : ""},
              </Text>
              <Text className="text-muted-foreground text-sm leading-6 m-0 mb-6">
                We received a request to reset your password. Click the button
                below to create a new password for your account.
              </Text>

              <Section className="bg-muted border-l-4 border-border rounded-r-lg px-4 py-3 mb-6">
                <Text className="text-muted-foreground text-[13px] leading-5 m-0">
                  This password reset link will expire soon for security
                  reasons.
                </Text>
              </Section>

              <Section className="my-8 text-center">
                <Link
                  href={reset_url}
                  className="bg-primary text-primary-foreground text-sm font-semibold rounded-[15px] px-7 py-3.5 no-underline inline-block"
                >
                  Reset Password
                </Link>
              </Section>

              <Section className="my-8">
                <Text className="text-muted-foreground text-sm leading-6 m-0">
                  Or copy and paste this URL into your browser:
                </Text>
                <Link
                  href={reset_url}
                  className="text-muted-foreground no-underline text-sm leading-6 break-all underline"
                >
                  {reset_url}
                </Link>
              </Section>

              <Section className="bg-muted border-l-4 border-border rounded-r-lg px-4 py-3">
                <Text className="text-muted-foreground text-[13px] leading-5 m-0">
                  <strong className="text-foreground">
                    Didn't request a password reset?
                  </strong>{" "}
                  You can safely ignore this email. Your password will remain
                  unchanged.
                </Text>
              </Section>
            </Section>

            <Section className="border-t border-border mx-10" />

            {/* Footer */}
            <Section className="px-10 py-6">
              <Text className="text-muted-foreground text-xs leading-5 m-0 mb-1">
                For security reasons, never share this reset link with anyone.
                If you're having trouble with the button above, copy and paste
                the URL into your web browser.
              </Text>
              <Text className="text-muted-foreground text-xs leading-5 m-0">
                © {new Date().getFullYear()} Medusajs, Inc. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

export const PasswordResetEmail = (props: PasswordResetEmailProps) => (
  <PasswordResetEmailComponent {...props} />
);
