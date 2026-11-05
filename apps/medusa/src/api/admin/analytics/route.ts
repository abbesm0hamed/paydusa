import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules } from "@medusajs/framework/utils";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  try {
    const analyticsModuleService = req.scope.resolve(Modules.ANALYTICS);

    // Get analytics configuration status
    const providers = await analyticsModuleService.listProviders();

    res.status(200).json({
      message: "Analytics configuration retrieved successfully",
      providers: providers.map((provider) => ({
        enabled: true,
        id: provider.id,
        name: provider.name || provider.id,
      })),
      success: true,
    });
  } catch (error) {
    console.error("Analytics configuration error:", error);
    res.status(500).json({
      details: error.message,
      error: "Failed to retrieve analytics configuration",
    });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { event, actor_id, properties } = req.body;

  try {
    const analyticsModuleService = req.scope.resolve(Modules.ANALYTICS);

    await analyticsModuleService.track({
      actor_id,
      event,
      properties,
    });

    res.status(200).json({
      message: `Event ${event} tracked successfully`,
      success: true,
    });
  } catch (error) {
    console.error("Analytics tracking error:", error);
    res.status(500).json({
      details: error.message,
      error: "Failed to track analytics event",
    });
  }
};
