import * as itty_router from 'itty-router';
import { IRequest, RouterOptions } from 'itty-router';

type DefaultLogger = (message: string) => void;
type ErrorLogger = (message: string) => void;

type Headers = Record<string, string>;
type JSONObject = Record<string, unknown>;

type Request = {
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

type ResponseObject<BodyType = unknown> = {
  body: BodyType;
  statusCode: number;
  headers: Headers;
};
type BufferFromArgTypes = Parameters<typeof Buffer.from>[0];
type Response = {
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

type Context = {
  req: Request;
  res: Response;
  log: DefaultLogger;
  error: ErrorLogger;
};

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

type Options = {
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
/**
 * @internal
 */
declare function tracePrototypeChainOf(object: object): string;
type WrapperRequestType = IRequest;
declare function createRouter({ ...args }?: RouterOptions<WrapperRequestType, [
    Request,
    Response,
    DefaultLogger,
    ErrorLogger
] & any[]>): itty_router.RouterType<IRequest, [Request, Response, DefaultLogger, ErrorLogger] & any[], ResponseObject>;
declare function runRouter(router: ReturnType<typeof createRouter>, { req, res, log, error }: Context): Promise<ResponseObject>;
declare function handleRequest(context: Context, withRouter: (router: ReturnType<typeof createRouter>) => void, options?: Options): Promise<ResponseObject>;

export { type Options, type WrapperRequestType, createRouter, handleRequest, runRouter, tracePrototypeChainOf };
