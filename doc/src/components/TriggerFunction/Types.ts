// Shared types and interfaces

export interface MockApiResponse {
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
  body?: any;
}
