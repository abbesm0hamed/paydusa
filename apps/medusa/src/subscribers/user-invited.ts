import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";

export default async function inviteCreatedHandler({
  event: { data },
  container,
}: SubscriberArgs<{
  id: string;
}>) {
  const query = container.resolve("query");
  const notificationModuleService = container.resolve("notification");
  const config = container.resolve("configModule");

  const {
    data: [invite],
  } = await query.graph({
    entity: "invite",
    fields: ["email", "token"],
    filters: {
      id: data.id,
    },
  });

  const backend_url =
    config.admin.backendUrl === "/"
      ? "http://localhost:9000"
      : config.admin.backendUrl;
  const adminPath = config.admin.path;

  await notificationModuleService.createNotifications({
    channel: "email",
    data: {
      invite_url: `${backend_url}${adminPath}/invite?token=${invite.token}`,
    },
    template: "user-invited",
    to: invite.email,
  });
}

export const config: SubscriberConfig = {
  event: ["invite.created", "invite.resent"],
};
