// Shared types and interfaces

export interface Param {
  name: string;
  value: string;
}

export interface MockApiResponse {
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
  body?: any;
}
