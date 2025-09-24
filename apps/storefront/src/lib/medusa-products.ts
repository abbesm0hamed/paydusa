import { getAuthenticatedSDK } from './medusa-auth';

export async function updateProduct(productId: string, updateData: any): Promise<any> {
  const sdk = await getAuthenticatedSDK();
  const response = await sdk.admin.product.update(productId, updateData);
  return response;
}

export async function createProduct(productData: any): Promise<any> {
  const sdk = await getAuthenticatedSDK();
  const response = await sdk.admin.product.create(productData);
  return response;
}

export async function deleteProduct(productId: string): Promise<any> {
  const sdk = await getAuthenticatedSDK();
  const response = await sdk.admin.product.delete(productId);
  return response;
}

export async function getProduct(productId: string): Promise<any> {
  const sdk = await getAuthenticatedSDK();
  const response = await sdk.admin.product.retrieve(productId);
  return response;
}

export async function listProducts(query?: any): Promise<any> {
  const sdk = await getAuthenticatedSDK();
  const response = await sdk.admin.product.list(query);
  return response;
}
