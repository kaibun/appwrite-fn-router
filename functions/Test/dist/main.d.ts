type DefaultLogger$1 = (message: string) => void;
type ErrorLogger$1 = (message: string) => void;

type Headers$1 = Record<string, string>;

type ResponseObject$1<BodyType = unknown> = {
  body: BodyType;
  statusCode: number;
  headers: Headers$1;
};

declare global {
  var log: DefaultLogger$1;
  var error: ErrorLogger$1;

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

type DefaultLogger = (message: string) => void;
type ErrorLogger = (message: string) => void;
type Headers = Record<string, string>;
type JSONObject = Record<string, unknown>;
type ResponseObject<T = any> = {
    body: T;
    headers: Headers;
    statusCode: number;
    toString(): string;
};
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
type BufferFromArgTypes = Parameters<typeof Buffer.from>[0];
type Response = {
    send: (body: string, statusCode?: number, headers?: Headers) => ResponseObject<string>;
    text: (body: string, statusCode?: number, headers?: Headers) => ResponseObject<string>;
    binary: (data: BufferFromArgTypes, statusCode?: number, headers?: Headers) => ResponseObject<string>;
    json<DataType = JSONObject>(data: DataType, statusCode?: number, headers?: Headers): ResponseObject<DataType>;
    empty: () => ResponseObject;
    redirect: (url: string, statusCode?: number, headers?: Headers) => ResponseObject<string>;
};
type Context = {
    req: Request;
    res: Response;
    log: DefaultLogger;
    error: ErrorLogger;
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

/**
 * Test function
 */
declare const _default: (context: Context) => Promise<ResponseObject$1>;

export { _default as default };
