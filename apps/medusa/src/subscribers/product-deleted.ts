import {
  SubscriberArgs,
  type SubscriberConfig,
} from "@medusajs/framework"
import { deleteProductsFromAlgoliaWorkflow } from "../workflows/delete-products-from-algolia"

export default async function productDeletedHandler({ 
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger")
  
  try {
    logger.info(`Deleting product ${event.data.id} from Algolia...`)
    
    await deleteProductsFromAlgoliaWorkflow(container).run({
      input: {
        ids: [event.data.id],
      },
    })
    
    logger.info(`Successfully deleted product ${event.data.id} from Algolia`)
  } catch (error) {
    logger.error(`Failed to delete product ${event.data.id} from Algolia:`, error)
  }
}

export const config: SubscriberConfig = {
  event: "product.deleted",
}
