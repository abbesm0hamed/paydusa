export interface PayloadModuleOptions {
  serverUrl: string;
  apiKey: string;
  userCollection?: string;
}

export interface PayloadCollectionItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  medusa_id: string;
  [key: string]: any;
}

export interface PayloadUpsertData {
  [key: string]: any;
}

export interface PayloadQueryOptions {
  depth?: number;
  locale?: string;
  fallbackLocale?: string;
  select?: string;
  populate?: string;
  limit?: number;
  page?: number;
  sort?: string;
  where?: Record<string, any>;
}

export interface PayloadItemResult<T = PayloadCollectionItem> {
  doc: T;
  message: string;
}

export interface PayloadBulkResult<T = PayloadCollectionItem> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
  pagingCounter: number;
}

export interface PayloadMediaResult {
  doc: {
    id: number;
    url: string;
    filename?: string;
    mimeType?: string;
    alt?: string;
    sizes?: Record<string, { url: string; width: number; height: number }>;
  };
  message: string;
}

export interface PayloadApiResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    field?: string;
  }>;
  message?: string;
}
