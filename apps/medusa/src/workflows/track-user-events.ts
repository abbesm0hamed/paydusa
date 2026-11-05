import { Modules } from "@medusajs/framework/utils";
import { createWorkflow, createStep } from "@medusajs/framework/workflows-sdk";

interface UserWorkflowInput {
  customer_id: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

const trackUserSignupStep = createStep(
  "track-user-signup-step",
  async (
    { customer_id, email, first_name, last_name }: UserWorkflowInput,
    { container }
  ) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS);

    await analyticsModuleService.track({
      actor_id: customer_id,
      event: "user_signed_up",
      properties: {
        customer_id,
        email: email || "",
        first_name: first_name || "",
        last_name: last_name || "",
        timestamp: new Date(),
      },
    });
  }
);

export const trackUserSignupWorkflow = createWorkflow(
  "track-user-signup",
  ({ customer_id, email, first_name, last_name }: UserWorkflowInput) => {
    trackUserSignupStep({
      customer_id,
      email,
      first_name,
      last_name,
    });
  }
);

// Track product views
interface ProductViewInput {
  product_id: string;
  customer_id?: string;
  product_title?: string;
  product_handle?: string;
}

const trackProductViewStep = createStep(
  "track-product-view-step",
  async (
    {
      product_id,
      customer_id,
      product_title,
      product_handle,
    }: ProductViewInput,
    { container }
  ) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS);

    await analyticsModuleService.track({
      actor_id: customer_id,
      event: "product_viewed",
      properties: {
        customer_id,
        product_handle: product_handle || "",
        product_id,
        product_title: product_title || "",
        timestamp: new Date(),
      },
    });
  }
);

export const trackProductViewWorkflow = createWorkflow(
  "track-product-view",
  ({
    product_id,
    customer_id,
    product_title,
    product_handle,
  }: ProductViewInput) => {
    trackProductViewStep({
      customer_id,
      product_handle,
      product_id,
      product_title,
    });
  }
);

// Track search events
interface SearchEventInput {
  query: string;
  results_count: number;
  customer_id?: string;
}

const trackSearchEventStep = createStep(
  "track-search-event-step",
  async (
    { query, results_count, customer_id }: SearchEventInput,
    { container }
  ) => {
    const analyticsModuleService = container.resolve(Modules.ANALYTICS);

    await analyticsModuleService.track({
      actor_id: customer_id,
      event: "search_performed",
      properties: {
        customer_id,
        query,
        results_count,
        timestamp: new Date(),
      },
    });
  }
);

export const trackSearchEventWorkflow = createWorkflow(
  "track-search-event",
  ({ query, results_count, customer_id }: SearchEventInput) => {
    trackSearchEventStep({
      customer_id,
      query,
      results_count,
    });
  }
);
