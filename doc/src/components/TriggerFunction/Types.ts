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

export interface TriggerFunctionProps {
  method: string;
  url: string;
  body?: any;
  headers?: Record<string, string>;
  label?: string;
  urlParams?: string[];
  step?: number;
  onStepDone?: (response: any) => void;
  showHttpError?: boolean;
  showUrlDebug?: boolean;
  showDebugInfo?: boolean;
  readOnlyBody?: boolean;
  mockApi?: (params: {
    method: string;
    url: string;
    body?: any;
    headers: Record<string, string>;
  }) => Promise<MockApiResponse> | MockApiResponse;
  bodyOpenDefault?: boolean;
  headersOpenDefault?: boolean;
}
