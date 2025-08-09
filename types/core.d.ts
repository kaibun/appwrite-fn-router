// Core types for Appwrite Functions and itty-router integration

import type { IRequest } from 'itty-router';
import type { Request as FetchRequest } from 'undici';
import { E } from 'vitest/dist/chunks/environment.d.cL3nLXbE.js';

export type DefaultLogger = (message: string) => void;
export type ErrorLogger = (message: string) => void;

export type InternalObjects = {
  request: FetchRequest;
  [key: any]: unknown; // Allows for additional properties to be added dynamically
};

export type AFRContext = AppwriteContext & {
  req: AFRRequest;
  internals: InternalObjects;
};

/**
 * Type describing an Appwrite Function Router’s context.
 *
 * It extends the standard Appwrite `Context` with the following tweaks:
 *
 * - `req` is a `AFRRequest` (which includes all AppwriteRequest properties and getters)
 * - `internals` is an optional object that can hold additional internal state or objects.
 *
 * You may still pass any additional arguments to the context. They they will be ignored by the library, but will show up in your route handlers and
 * middlewares for you to use.
 *
 * Don’t forget you may also use the request object (first argument) as a mean
 * to pass additional data to your callbacks, which may be more semantic.
 */
export type AFRContextArgs = [
  AFRContext['req'],
  AFRContext['res'],
  AFRContext['log'],
  AFRContext['error'],
  AFRContext['internals'],
  ...any[],
];

export type CatchHandler = (...args: [Error, ...AFRContextArgs]) => any;

export type Headers = Record<string, string>;
export type JSONObject = Record<string, unknown>;

export type AppwriteResponseObject<T = any> = {
  body: T;
  headers?: Headers;
  statusCode: number;
  toString(): string;
};

export type Options = {
  globals?: boolean;
  env?: boolean;
  logs?: logEnableFn | boolean;
  cors?: {
    allowedOrigins?: (string | RegExp)[];
    allowMethods?: string[];
    allowHeaders?: string[];
  };
  ittyOptions?: RouterOptions<
    AFRRequest,
    [AppwriteResponse, DefaultLogger, ErrorLogger, InternalObjects] & any[]
  >;
};

export type FinalOptions = Options & { log: boolean; errorLog: boolean };

export type AppwriteRequest = {
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
export type AppwriteResponse = {
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

export type AppwriteContext = {
  req: AppwriteRequest;
  res: AppwriteResponse;
  log: DefaultLogger;
  error: ErrorLogger;
};

export type RouterJSONResponse = {
  status: 'success' | 'error';
  message: string;
  error?: string;
} & JSONObject;

/**
 * itty-router injects properties at runtime, such as params, query and route. TypeScript has to know about that to avoid type errors in route handlers. Also, it allows the end-user to inject her own properties. Basically, it’s AppwriteRequest on steroids and fit for itty-router consumption.
 * @see https://github.com/kwhitley/itty-router/blob/v5.x/src/Router.ts
 */
export type AFRRequest = IRequest & AppwriteRequest;

export type logEnableFn = (mode: 'log' | 'errorLog') => boolean;
