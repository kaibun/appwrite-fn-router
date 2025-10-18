import { IRequest } from 'itty-router';
import { Request } from 'undici';
import { z } from 'zod';

// Core types for Appwrite Functions and itty-router integration



type DefaultLogger = (message: string) => void;
type ErrorLogger = (message: string) => void;

type InternalObjects = {
  request: Request;
  [key: any]: unknown; // Allows for additional properties to be added dynamically
};

type AFRContext = AppwriteContext & {
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
type AFRContextArgs = [
  AFRContext['req'],
  AFRContext['res'],
  AFRContext['log'],
  AFRContext['error'],
  AFRContext['internals'],
  ...any[],
];

type CatchHandler = (...args: [Error, ...AFRContextArgs]) => any;

type Headers = Record<string, string>;
type JSONObject = Record<string, unknown>;

type AppwriteResponseObject<T = any> = {
  body: T;
  headers?: Headers;
  statusCode: number;
  toString(): string;
};

type Options = {
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

type FinalOptions = Options & { log: boolean; errorLog: boolean };

type AppwriteRequest = {
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

type BufferFromArgTypes = Parameters<typeof Buffer.from>[0];
type AppwriteResponse = {
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

type AppwriteContext = {
  req: AppwriteRequest;
  res: AppwriteResponse;
  log: DefaultLogger;
  error: ErrorLogger;
};

type RouterJSONResponse = {
  status: 'success' | 'error';
  message: string;
  error?: string;
} & JSONObject;

/**
 * itty-router injects properties at runtime, such as params, query and route. TypeScript has to know about that to avoid type errors in route handlers. Also, it allows the end-user to inject her own properties. Basically, it’s AppwriteRequest on steroids and fit for itty-router consumption.
 * @see https://github.com/kwhitley/itty-router/blob/v5.x/src/Router.ts
 */
type AFRRequest = AppwriteRequest & IRequest; // & { [key: string]: any };

type logEnableFn = (mode: 'log' | 'errorLog') => boolean;

// Zod schema for Widget (extends AppwriteDocument)
declare const WidgetSchema = AppwriteDocumentSchema.extend({
  weight: z.number(),
  color: z.enum(['red', 'blue', 'gold']),
});

type WidgetInput = z.infer<typeof WidgetSchema>;

// Shared Widget types and validation functions



// Type guards for validation
declare const isValidWidget = (obj: any): obj is WidgetInput => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.$id === 'string' &&
    typeof obj.$collectionId === 'string' &&
    typeof obj.$databaseId === 'string' &&
    typeof obj.$createdAt === 'string' &&
    typeof obj.$updatedAt === 'string' &&
    Array.isArray(obj.$permissions) &&
    typeof obj.$sequence === 'number' &&
    typeof obj.weight === 'number' &&
    ['red', 'blue', 'gold'].includes(obj.color)
  );
};

declare const isValidWidgetArray = (obj: any): obj is WidgetInput[] => {
  return Array.isArray(obj) && obj.every(isValidWidget);
};

// Global type declarations for the library



declare global {
  var log: DefaultLogger;
  var error: ErrorLogger;

  namespace NodeJS {
    interface ProcessEnv {
      APPWRITE_FUNCTION_API_ENDPOINT: string;
      APPWRITE_FUNCTION_PROJECT_ID: string;
      APPWRITE_FUNCTION_API_KEY: string;
      //   APPWRITE_DATABASE_ID: string;
      //   APPWRITE_COLLECTION_ID: string;
    }
  }
}

export { type AFRContext, type AFRContextArgs, type AFRRequest, type AppwriteContext, type AppwriteRequest, type AppwriteResponse, type AppwriteResponseObject, type BufferFromArgTypes, type CatchHandler, type DefaultLogger, type ErrorLogger, type FinalOptions, type Headers, type InternalObjects, type JSONObject, type Options, type RouterJSONResponse, type WidgetInput, isValidWidget, isValidWidgetArray, type logEnableFn };
