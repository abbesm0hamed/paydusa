import { StoreProductWithPayload } from "../../types/global";

const PAYLOAD_SERVER_URL = process.env.PAYLOAD_SERVER_URL;

export function getProductThumbnail(product: StoreProductWithPayload) {
  if (product?.payload_product?.thumbnail) {
    const thumb = product.payload_product.thumbnail;
    
    if (thumb.sizes_thumbnail_url) {
      return {
        url: thumb.sizes_thumbnail_url,
        alt: thumb.alt || product.title || 'Product image',
      };
    }
    
    if (thumb.sizes?.thumbnail?.url) {
      return {
        url: thumb.sizes.thumbnail.url,
        alt: thumb.alt || product.title || 'Product image',
      };
    }
    
    if (thumb.url && thumb.url.startsWith('https://')) {
      return {
        url: thumb.url,
        alt: thumb.alt || product.title || 'Product image',
      };
    }
    
    if (thumb.thumbnailURL && thumb.thumbnailURL.startsWith('https://')) {
      return {
        url: thumb.thumbnailURL,
        alt: thumb.alt || product.title || 'Product image',
      };
    }
  }
  
  // Fallback to Medusa thumbnail
  if (product.thumbnail) {
    return {
      url: product.thumbnail,
      alt: product.title || 'Product image',
    };
  }
  
  // Fallback to first image from Payload CMS
  if (product?.payload_product?.images && product.payload_product.images.length > 0) {
    const firstImage = product.payload_product.images[0];
    return {
      url: formatPayloadImageUrl(firstImage.image.url),
      alt: firstImage.image.alt || product.title || 'Product image',
    };
  }
  
  // Fallback to first Medusa image
  if (product.images && product.images.length > 0) {
    return {
      url: product.images[0].url,
      alt: product.title || 'Product image',
    };
  }
  
  return null;
}

export function getProductImages(product: StoreProductWithPayload) {
  if (product?.payload_product?.images?.length) {
    return product.payload_product.images.map((image) => ({
      id: image.id,
      url: formatPayloadImageUrl(image.image.url),
    }));
  }
  
  return product.images?.map((image) => ({
    id: image.id,
    url: image.url,
  })) || [];
}

export function formatPayloadImageUrl(url: string): string {
  if (!url) return '';
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  if (!PAYLOAD_SERVER_URL) {
    console.warn('PAYLOAD_SERVER_URL not configured, returning original URL');
    return url;
  }
  
  if (url.startsWith('/api/media/file')) {
    return `${PAYLOAD_SERVER_URL}${url}`;
  }
  
  if (!url.startsWith('/')) {
    return `${PAYLOAD_SERVER_URL}/api/media/file/${url}`;
  }
  
  return `${PAYLOAD_SERVER_URL}${url}`;
}
