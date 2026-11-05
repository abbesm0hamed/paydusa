import { createStep } from "@medusajs/framework/workflows-sdk";

interface TrackEventStepInput {
  event: string;
  userId?: string;
  properties?: Record<string, unknown>;
  timestamp?: Date;
}

export const trackEventStep = createStep(
  "track-event",
  async (input: TrackEventStepInput, { container }) => {
    const analyticsModuleService = container.resolve("analytics");

    if (!input.userId) {
      // generate a random user id
      input.properties = {
        ...input.properties,
        anonymousId:
          Math.random().toString(36).slice(2, 15) +
          Math.random().toString(36).slice(2, 15),
      };
    }

    await analyticsModuleService.track({
      actor_id: input.userId,
      event: input.event,
      properties: input.properties,
    });
  }
);
