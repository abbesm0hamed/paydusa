import Medusa from '@medusajs/js-sdk';

function createSDK(): Medusa {
  const baseUrl = process.env.MEDUSA_BACKEND_URL!!;
  
  return new Medusa({
    baseUrl,
    debug: process.env.NODE_ENV === 'development',
    auth: {
      type: 'jwt',
      jwtTokenStorageMethod: 'memory',
    },
  });
}

export async function getAuthenticatedSDK(): Promise<Medusa> {
  const sdk = createSDK();
  
  const email = process.env.MEDUSA_ADMIN_EMAIL!!;
  const password = process.env.MEDUSA_ADMIN_PASSWORD!!;

  const result = await sdk.auth.login('user', 'emailpass', {
    email,
    password,
  });

  if (typeof result === 'string') {
    return sdk;
  } else if (result && typeof result === 'object' && 'location' in result) {
    throw new Error('Unexpected redirect required for authentication');
  } else {
    throw new Error('Authentication failed - no token received');
  }
}
