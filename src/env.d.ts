export type DefaultLogger = (message: string) => void;
export type ErrorLogger = (message: string) => void;

export type Headers = Record<string, string>;
export type JSONObject = Record<string, unknown>;

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
  port: number;
  url: string;
  path: string;
};

export type ResponseObject<BodyType = unknown> = {
  body: BodyType;
  statusCode: number;
  headers: Headers;
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

export {};
