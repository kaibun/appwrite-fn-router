// Core types for Appwrite Functions and itty-router integration

import type { IRequest } from 'itty-router';

export type DefaultLogger = (message: string) => void;
export type ErrorLogger = (message: string) => void;

export type Headers = Record<string, string>;
export type JSONObject = Record<string, unknown>;

export type ResponseObject<T = any> = {
  body: T;
  headers: Headers;
  statusCode: number;
  toString(): string;
};

export type RunArgs = {
  data: {
    domainSlice: string;
  };
};

export type Request = {
  get body(): JSONObject | string;
  get bodyRaw(): string;
  get bodyText(): string;
  get bodyJson(): JSONObject;
  get bodyBinary(): Buffer;
  headers: Headers;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';
  host: string;
  scheme: 'http' | 'https';
  query: JSONObject;
  queryString: string;
  port: string;
  url: string;
  path: string;
};

export type BufferFromArgTypes = Parameters<typeof Buffer.from>[0];
export type Response = {
  send: (
    body: string,
    statusCode?: number,
    headers?: Headers
  ) => ResponseObject<string>;
  text: (
    body: string,
    statusCode?: number,
    headers?: Headers
  ) => ResponseObject<string>;
  binary: (
    data: BufferFromArgTypes,
    statusCode?: number,
    headers?: Headers
  ) => ResponseObject<string>;
  json<DataType = JSONObject>(
    data: DataType,
    statusCode?: number,
    headers?: Headers
  ): ResponseObject<DataType>;
  empty: () => ResponseObject;
  redirect: (
    url: string,
    statusCode?: number,
    headers?: Headers
  ) => ResponseObject<string>;
};

export type Context = {
  req: Request;
  res: Response;
  log: DefaultLogger;
  error: ErrorLogger;
};

// Router types from main.ts
export type Options = {
  globals?: boolean;
  env?: boolean;
  log?: boolean;
  errorLog?: boolean;
  onError?: (err: unknown) => void;
  cors?: {
    allowedOrigins?: (string | RegExp)[];
    allowMethods?: string[];
    allowHeaders?: string[];
  };
};

export type RouterJSONResponse = {
  status: 'success' | 'error';
  message: string;
  error?: string;
} & JSONObject;

// TODO: https://github.com/kaibun/appwrite-fn-router/issues/6
export type WrapperRequestType = IRequest & AppwriteRequest;
