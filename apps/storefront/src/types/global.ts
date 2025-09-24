import { StorePrice, StoreProduct } from "@medusajs/types"
// @ts-ignore
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export type FeaturedProduct = {
  id: string
  title: string
  handle: string
  thumbnail?: string
}

export type VariantPrice = {
  calculated_price_number: number
  calculated_price: string
  original_price_number: number
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export type StoreFreeShippingPrice = StorePrice & {
  target_reached: boolean
  target_remaining: number
  remaining_percentage: number
}

export type StoreProductWithPayload = StoreProduct & {
  payload_product?: {
    medusa_id: string
    title: string
    handle: string
    subtitle?: string
    description?: SerializedEditorState
    thumbnail_id?: number
    thumbnail?: {
      id: string
      url: string
      alt?: string
      filename?: string
      thumbnailURL?: string
      sizes_thumbnail_url?: string
      sizes_card_url?: string
      sizes_tablet_url?: string
      sizes?: {
        thumbnail?: {
          url: string
          width: number
          height: number
        }
        card?: {
          url: string
          width: number
          height: number
        }
        tablet?: {
          url: string
          width: number
          height: number
        }
      }
    }
    images: {
      id: string
      image: {
        id: string
        url: string
        alt?: string
        filename?: string
      }
    }[]
    options: {
      medusa_id: string
      title: string
    }[]
    variants: {
      medusa_id: string
      title: string
      option_values: {
        medusa_option_id: string
        value: string
      }[]
    }[]
  }
}
