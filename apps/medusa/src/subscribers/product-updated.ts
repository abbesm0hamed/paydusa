import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework"
import { syncProductsWorkflow } from "../workflows/sync-products"
import { updatePayloadProductsWorkflow } from "../workflows/update-payload-products"

export default async function productUpdatedHandler({ 
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  
  try {
    // Sync to Payload first
    logger.info(`Syncing updated product ${event.data.id} to Payload...`)
    
    await updatePayloadProductsWorkflow(container).run({
      input: {
        product_ids: [event.data.id],
      },
    })
    
    logger.info(`Successfully synced updated product ${event.data.id} to Payload`)
    
    // Then sync to Algolia
    logger.info(`Syncing updated product ${event.data.id} to Algolia...`)
    
    await syncProductsWorkflow(container).run({
      input: {
        filters: { id: event.data.id },
        limit: 1,
        offset: 0,
      },
    })
    
    logger.info(`Successfully synced updated product ${event.data.id} to Algolia`)
  } catch (error) {
    logger.error(`Failed to sync updated product ${event.data.id}:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "product.updated",
}
