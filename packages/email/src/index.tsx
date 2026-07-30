import { render } from "react-email";
import { Resend } from "resend";

import { OrderPlacedEmail } from "./templates/order-placed-email";
import { PasswordResetEmail } from "./templates/password-reset-email";
import { UserInvitedEmail } from "./templates/user-invited-email";

export { OrderPlacedEmail } from "./templates/order-placed-email";
export { PasswordResetEmail } from "./templates/password-reset-email";
export { UserInvitedEmail } from "./templates/user-invited-email";

export type EmailTemplate = "order-placed" | "password-reset" | "user-invited";

export const emailSubjects: Record<EmailTemplate, string> = {
  "order-placed": "Order Confirmation",
  "password-reset": "Reset Your Password",
  "user-invited": "You're Invited!",
};

export const emailTemplates: Record<
  EmailTemplate,
  (props: unknown) => React.ReactNode
> = {
  "order-placed": (props) => (
    <OrderPlacedEmail
      {...(props as React.ComponentProps<typeof OrderPlacedEmail>)}
    />
  ),
  "password-reset": (props) => (
    <PasswordResetEmail
      {...(props as React.ComponentProps<typeof PasswordResetEmail>)}
    />
  ),
  "user-invited": (props) => (
    <UserInvitedEmail
      {...(props as React.ComponentProps<typeof UserInvitedEmail>)}
    />
  ),
};

export async function renderTemplate(
  template: EmailTemplate,
  data: unknown
): Promise<string> {
  const component = emailTemplates[template];
  if (!component) {
    throw new Error(`Unknown email template: ${template}`);
  }
  return render(component(data) as React.ReactElement);
}

export async function sendEmail(
  resendClient: Resend,
  options: {
    from: string;
    to: string;
    template: EmailTemplate;
    data: unknown;
  }
) {
  const html = await renderTemplate(options.template, options.data);
  const subject = emailSubjects[options.template];

  return resendClient.emails.send({
    from: options.from,
    to: [options.to],
    subject,
    html,
  });
}
