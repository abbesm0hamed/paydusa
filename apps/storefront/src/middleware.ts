import { HttpTypes } from '@medusajs/types';
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const BACKEND_URL = process.env.MEDUSA_BACKEND_URL;
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || 'us';

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
};

// Create the intl middleware
const intlMiddleware = createIntlMiddleware(routing);

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache;

  if (!BACKEND_URL) {
    console.warn('MEDUSA_BACKEND_URL not configured, using fallback region');
    if (!regionMap.has(DEFAULT_REGION)) {
      regionMapCache.regionMap.set(DEFAULT_REGION, { 
        id: DEFAULT_REGION, 
        name: 'Default Region',
        countries: [{ iso_2: DEFAULT_REGION }]
      } as any);
    }
    return regionMapCache.regionMap;
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      if (!PUBLISHABLE_API_KEY) {
        console.warn('NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY not configured, using fallback region');
        regionMapCache.regionMap.set(DEFAULT_REGION, { 
          id: DEFAULT_REGION, 
          name: 'Default Region',
          countries: [{ iso_2: DEFAULT_REGION }]
        } as any);
        return regionMapCache.regionMap;
      }

      const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
        headers: {
          'x-publishable-api-key': PUBLISHABLE_API_KEY,
        },
        next: {
          revalidate: 3600,
          tags: [`regions-${cacheId}`],
        },
        cache: 'force-cache',
      }).then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch regions`);
        }

        const json = await response.json();
        return json;
      });

      if (!regions?.length) {
        console.warn('No regions found from Medusa API, using fallback region');
        // Set fallback region
        regionMapCache.regionMap.set(DEFAULT_REGION, { 
          id: DEFAULT_REGION, 
          name: 'Default Region',
          countries: [{ iso_2: DEFAULT_REGION }]
        } as any);
        return regionMapCache.regionMap;
      }

      // Clear existing map and populate with fresh data
      regionMapCache.regionMap.clear();
      
      // Create a map of country codes to regions.
      regions.forEach((region: HttpTypes.StoreRegion) => {
        region.countries?.forEach((c) => {
          regionMapCache.regionMap.set(c.iso_2 ?? '', region);
        });
      });

      regionMapCache.regionMapUpdated = Date.now();
    } catch (error) {
      console.warn('Error fetching regions from Medusa:', error);
      // Set fallback region on error
      if (!regionMap.has(DEFAULT_REGION)) {
        regionMapCache.regionMap.set(DEFAULT_REGION, { 
          id: DEFAULT_REGION, 
          name: 'Default Region',
          countries: [{ iso_2: DEFAULT_REGION }]
        } as any);
      }
    }
  }

  return regionMapCache.regionMap;
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param regionMap
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode;

    const vercelCountryCode = request.headers
      .get('x-vercel-ip-country')
      ?.toLowerCase();

    // Extract country code from URL, accounting for locale prefix
    const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
    const locales = routing.locales;

    // Check if first segment is a locale
    const firstSegment = pathSegments[0]?.toLowerCase();
    const isLocaleInPath = locales.includes(firstSegment as any);

    // Get country code from URL (after locale if present)
    const urlCountryCode = isLocaleInPath
      ? pathSegments[1]?.toLowerCase()
      : firstSegment;

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode;
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode;
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION;
    } else {
      // Always fallback to first available region if default not found
      const firstRegion = regionMap.keys().next().value;
      if (firstRegion) {
        countryCode = firstRegion;
      } else {
        // Ultimate fallback to DEFAULT_REGION even if not in map
        countryCode = DEFAULT_REGION;
      }
    }

    return countryCode;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(
        'Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a MEDUSA_BACKEND_URL environment variable? Note that the variable is no longer named NEXT_PUBLIC_MEDUSA_BACKEND_URL.'
      );
    }
  }
}

/**
 * Check if URL has country code, accounting for locale prefix
 */
function checkUrlHasCountryCode(request: NextRequest, countryCode: string) {
  const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
  const locales = routing.locales;

  // Check if first segment is a locale
  const firstSegment = pathSegments[0]?.toLowerCase();
  const isLocaleInPath = locales.includes(firstSegment as any);

  // Get country code from URL (after locale if present)
  const urlCountryCode = isLocaleInPath
    ? pathSegments[1]?.toLowerCase()
    : firstSegment;

  return urlCountryCode === countryCode;
}

/**
 * Combined middleware to handle both internationalization and region selection.
 * This ignores /admin paths and doesn't redirect them.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for admin and API paths
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.startsWith('/graphql-playground') ||
    pathname.startsWith('/graphql') ||
    pathname.startsWith('/next')
  ) {
    return NextResponse.next();
  }

  // Skip for static assets
  if (pathname.includes('.')) {
    return NextResponse.next();
  }

  // First, handle internationalization
  const intlResponse = intlMiddleware(request);

  // If intl middleware returns a redirect, we need to handle region logic with the new URL
  if (intlResponse && intlResponse.headers.get('location')) {
    const redirectLocation = intlResponse.headers.get('location');
    if (redirectLocation) {
      // Create a new request object with the redirected URL for region processing
      const newUrl = new URL(redirectLocation);
      const newRequest = new NextRequest(newUrl);
      request = newRequest;
    }
  }

  let cacheIdCookie = request.cookies.get('_medusa_cache_id');
  let cacheId = cacheIdCookie?.value || crypto.randomUUID();

  try {
    const regionMap = await getRegionMap(cacheId);
    const countryCode = regionMap && (await getCountryCode(request, regionMap));

    if (!countryCode) {
      // If we can't determine country code, just return the intl response
      return intlResponse || NextResponse.next();
    }

    const urlHasCountryCode = checkUrlHasCountryCode(request, countryCode);

    // If URL has country code and cache ID is set, return the intl response or next
    if (urlHasCountryCode && cacheIdCookie) {
      return intlResponse || NextResponse.next();
    }

    // If URL has country code but no cache ID, set cache ID
    if (urlHasCountryCode && !cacheIdCookie) {
      const response = intlResponse || NextResponse.next();
      response.cookies.set('_medusa_cache_id', cacheId, {
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    // If no country code in URL, we need to add it
    if (!urlHasCountryCode) {
      const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
      const locales = routing.locales;

      // Check if first segment is a locale
      const firstSegment = pathSegments[0];
      const isLocaleInPath =
        firstSegment && locales.includes(firstSegment as any);

      let newPathname;
      if (isLocaleInPath) {
        // Pattern: /[locale]/[country]/[...rest] or /[locale]/
        const restPath = pathSegments.slice(1).join('/');
        newPathname = `/${firstSegment}/${countryCode}${restPath ? '/' + restPath : ''}`;
      } else {
        // Pattern: /[country]/[...rest] or /
        const restPath = pathSegments.join('/');
        newPathname = `/${countryCode}${restPath ? '/' + restPath : ''}`;
      }

      const queryString = request.nextUrl.search;
      const redirectUrl = `${request.nextUrl.origin}${newPathname}${queryString}`;

      const response = NextResponse.redirect(redirectUrl, 307);
      response.cookies.set('_medusa_cache_id', cacheId, {
        maxAge: 60 * 60 * 24,
      });

      return response;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Middleware.ts: Error in region handling:', error);
    }
    // Fallback to intl middleware response if region handling fails
    return intlResponse || NextResponse.next();
  }

  return intlResponse || NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, or `/admin`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|svg|jpg|jpeg|gif|webp|_next|_next/image|_next/static|assets|_vercel|admin|graphql-playground|graphql|next|.*\\..*).*)',
  ],
};
