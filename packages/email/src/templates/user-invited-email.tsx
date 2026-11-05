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

interface UserInvitedEmailProps {
  invite_url: string;
  email?: string;
}

function UserInvitedEmailComponent({
  invite_url,
  email,
}: UserInvitedEmailProps): ReactElement {
  return (
    <Tailwind config={emailTheme}>
      <Html lang="en">
        <Head />
        <Preview>You've been invited to join our platform</Preview>
        <Body className="bg-muted py-10 font-sans">
          <Container className="bg-background border-border mx-auto max-w-[520px] overflow-hidden rounded-[19px] border">
            {/* Header */}
            <Section className="bg-primary px-10 py-6">
              <Text className="text-primary-foreground m-0 text-base font-bold tracking-tight">
                Medusa Store
              </Text>
            </Section>

            {/* Main content */}
            <Section className="px-10 pt-10 pb-8">
              <Text className="bg-muted border-border text-muted-foreground m-0 mb-6 inline-block rounded-full border px-3 py-1 text-[11px] font-semibold tracking-widest uppercase">
                Invitation
              </Text>

              <Heading
                as="h1"
                className="text-foreground m-0 mb-3 text-2xl leading-snug font-bold tracking-tight"
              >
                You're Invited!
              </Heading>

              <Text className="text-muted-foreground m-0 mb-6 text-sm leading-6">
                Hello{email ? ` ${email}` : ""},
              </Text>
              <Text className="text-muted-foreground m-0 mb-6 text-sm leading-6">
                You've been invited to join our platform. Click the button below
                to accept your invitation and set up your account.
              </Text>

              <Section className="my-8 text-center">
                <Link
                  href={invite_url}
                  className="bg-primary text-primary-foreground inline-block rounded-[15px] px-7 py-3.5 text-sm font-semibold no-underline"
                >
                  Accept Invitation
                </Link>
              </Section>

              <Section className="my-8">
                <Text className="text-muted-foreground m-0 text-sm leading-6">
                  Or copy and paste this URL into your browser:
                </Text>
                <Link
                  href={invite_url}
                  className="text-muted-foreground text-sm leading-6 break-all no-underline underline"
                >
                  {invite_url}
                </Link>
              </Section>

              <Section className="bg-muted border-border rounded-r-lg border-l-4 px-4 py-3">
                <Text className="text-muted-foreground m-0 text-[13px] leading-5">
                  If you weren't expecting this invitation, you can ignore this
                  email.
                </Text>
              </Section>
            </Section>

            <Section className="border-border mx-10 border-t" />

            {/* Footer */}
            <Section className="px-10 py-6">
              <Text className="text-muted-foreground m-0 text-xs leading-5">
                © {new Date().getFullYear()} Medusajs, Inc. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}

export const UserInvitedEmail = (props: UserInvitedEmailProps) => (
  <UserInvitedEmailComponent {...props} />
);
