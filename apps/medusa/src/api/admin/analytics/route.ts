import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

export const GET = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  try {
    const analyticsModuleService = req.scope.resolve(Modules.ANALYTICS)
    
    // Get analytics configuration status
    const providers = await analyticsModuleService.listProviders()
    
    res.status(200).json({
      success: true,
      providers: providers.map(provider => ({
        id: provider.id,
        name: provider.name || provider.id,
        enabled: true,
      })),
      message: "Analytics configuration retrieved successfully",
    })
  } catch (error) {
    console.error("Analytics configuration error:", error)
    res.status(500).json({
      error: "Failed to retrieve analytics configuration",
      details: error.message,
    })
  }
}

export const POST = async (
  req: MedusaRequest,
  res: MedusaResponse
) => {
  const { event, actor_id, properties } = req.body

  try {
    const analyticsModuleService = req.scope.resolve(Modules.ANALYTICS)
    
    await analyticsModuleService.track({
      event,
      actor_id,
      properties,
    })

    res.status(200).json({
      success: true,
      message: `Event ${event} tracked successfully`,
    })
  } catch (error) {
    console.error("Analytics tracking error:", error)
    res.status(500).json({
      error: "Failed to track analytics event",
      details: error.message,
    })
  }
}
