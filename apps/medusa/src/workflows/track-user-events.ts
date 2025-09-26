import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"

type UserWorkflowInput = {
  customer_id: string
  email?: string
  first_name?: string
  last_name?: string
}

const trackUserSignupStep = createStep(
  "track-user-signup-step",
  async ({ customer_id, email, first_name, last_name }: UserWorkflowInput, { container }) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS)

    await analyticsModuleService.track({
      event: "user_signed_up",
      actor_id: customer_id,
      properties: {
        customer_id,
        email: email || "",
        first_name: first_name || "",
        last_name: last_name || "",
        timestamp: new Date(),
      },
    })
  }
)

export const trackUserSignupWorkflow = createWorkflow(
  "track-user-signup",
  ({ customer_id, email, first_name, last_name }: UserWorkflowInput) => {
    trackUserSignupStep({
      customer_id,
      email,
      first_name,
      last_name,
    })
  }
)

// Track product views
type ProductViewInput = {
  product_id: string
  customer_id?: string
  product_title?: string
  product_handle?: string
}

const trackProductViewStep = createStep(
  "track-product-view-step",
  async ({ product_id, customer_id, product_title, product_handle }: ProductViewInput, { container }) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS)

    await analyticsModuleService.track({
      event: "product_viewed",
      actor_id: customer_id,
      properties: {
        product_id,
        product_title: product_title || "",
        product_handle: product_handle || "",
        customer_id,
        timestamp: new Date(),
      },
    })
  }
)

export const trackProductViewWorkflow = createWorkflow(
  "track-product-view",
  ({ product_id, customer_id, product_title, product_handle }: ProductViewInput) => {
    trackProductViewStep({
      product_id,
      customer_id,
      product_title,
      product_handle,
    })
  }
)

// Track search events
type SearchEventInput = {
  query: string
  results_count: number
  customer_id?: string
}

const trackSearchEventStep = createStep(
  "track-search-event-step",
  async ({ query, results_count, customer_id }: SearchEventInput, { container }) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS)

    await analyticsModuleService.track({
      event: "search_performed",
      actor_id: customer_id,
      properties: {
        query,
        results_count,
        customer_id,
        timestamp: new Date(),
      },
    })
  }
)

export const trackSearchEventWorkflow = createWorkflow(
  "track-search-event",
  ({ query, results_count, customer_id }: SearchEventInput) => {
    trackSearchEventStep({
      query,
      results_count,
      customer_id,
    })
  }
)
