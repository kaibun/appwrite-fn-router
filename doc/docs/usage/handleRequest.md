---
sidebar_position: 2
---

# `handleRequest`

The `handleRequest` function is the main entry point for your Appwrite Function when using this router. It sets up the environment, initializes the router with your routes and configuration, and handles incoming requests.

It’s likely the only method you’ll need to call to use this library.

## Signature

```typescript
async function handleRequest(
  context: AppwriteContext,
  withRouter: (router: ReturnType<typeof createRouter>) => void,
  options?: Options
): Promise<AppwriteResponseObject | undefined>;
```

### Parameters

- `context`: The standard Appwrite Function’s context object (`{ req, res, log, error }`).
- `withRouter`: A callback function where you define all your routes by [calling itty-router methods](https://itty.dev/itty-router/getting-started#_3-register-routes) on the provided [`Router`](https://itty.dev/itty-router/api#router) instance.
- `options`: An optional configuration object to customize AFR and its internal router's behaviors.

### Returned value

A promise for an [AppwriteResponseObject](/api/modules/types#responseobject) or the `undefined` litteral. The function might throw an exception.

## Options

The `options` object allows you to configure various aspects of the router:

| Option    | Type                                                                                                          | Default                                                                 | Description                                                                                                                                                                                                                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `globals` | `boolean`                                                                                                     | `true`                                                                  | If `true`, promotes some variables as globals, such as `log` and `error`.                                                                                                                                                                                                                             |
| `env`     | `boolean`                                                                                                     | `true`                                                                  | If `true`, promotes some headers to env vars, such as `x-appwrite-key` becoming `APPWRITE_FUNCTION_API_KEY`.                                                                                                                                                                                          |
| `logs`    | `boolean \| (mode: "log" \| "errorLog") => boolean`                                                           | `true` if `NODE_ENV` or `APP_ENV` is either `"development"` or `"test"` | Enables or disables logging and error logging. You can pass a boolean or a callback that receives a mode string (ie. the callback will be called twice) and returns a boolean. By default, logs are only enabled in development and test environments.                                                |
| `catch`   | `(err: unknown, req: AppwriteRequest, res: AppwriteResponse, log: DefaultLogger, error: ErrorLogger) => void` | `undefined`                                                             | Custom error handler called whenever an unhandled error occurs in any handler or middleware. Receives the error and the AFR context (`req`, `res`, `log`, `error`). Lets you log, report, or customize error handling globally. Note: the signature is adapted internally to match itty-router's API. |
| `cors`    | `object`                                                                                                      | `{...}`                                                                 | Configuration for Cross-Origin Resource Sharing (CORS).                                                                                                                                                                                                                                               |

### Logging control with `logs`

You can control logging globally using the `logs` option. This can be:

- A boolean (`true` or `false`) to enable or disable all logs (including error logs).
- A callback function `(mode: "log" || "errorLog") => boolean`, called twice by the library with either mode, that receives a string and returns `true` to enable that logging mode or `false` to disable it. By default, both log modes are enabled in development and test envs (`process.env.[APP_ENV|NODE_ENV] === ['development'|'test']`), disabled otherwise.

Example:

```typescript
handleRequest(
  context,
  (router) => {
    // ...
  },
  {
    // Enable error logs only, and only if a custom header is present.
    logs: (mode) => mode === 'errorLog' && req.headers['x-debug'] === '1',
  }
);
```

### Global error handling with `catch`

Although AFR provides error handling by default with a generic 500 "Internal Server Error" response, you may provide a custom error handler using the `catch` option.

This callback is invoked whenever an unhandled error occurs in any route handler or middleware. It receives the error and a partial AFR context (`req`, `res`, `log`, `error` but not `internals`). Use it to log errors, send them to a monitoring service, or customize the error response globally. You may also re-throw to trigger AFR’s default error handler.

```typescript
handleRequest(
  { req, res, log, error },
  (router) => {
    // ...
  },
  {
    catch: (err, req, res, log, error) => {
      // Custom error logging or reporting with full context.
      log('Error intercepted by catch:', err);
      // You can also use req, res, error, etc.
    },
  }
);
```

### CORS Configuration with `cors`

You can provide a flexible CORS configuration to control how your function responds to requests from different origins.

The `cors` option object has the following properties:

- `allowedOrigins`: An array of strings or `RegExp` objects for allowed origins.
- `allowMethods`: An array of allowed HTTP methods.
- `allowHeaders`: An array of allowed request headers.

:::note

For a smoother local development experience, in `"development"` and `"test"` envs, both `http://localhost:3000` (ie. the [Test Function](https://github.com/kaibun/appwrite-fn-router/tree/main/functions/Test) or your own Function) and `https://localhost:3001` (ie. [Docusaurus](https://github.com/kaibun/appwrite-fn-router/tree/main/doc) or any process you’d like) are automatically added to the `allowedOrigins` list. This allows for sending CORS request between localhost ports.

:::

## Example

Here is how you should use `handleRequest`, including the CORS configuration to allow requests from (in this example) your production domain. Beware `handleRequet` is an async function, therefore your must `await` (and usually `return`) its response.

```typescript
import { handleRequest, AppwriteResponseObject } from 'appwrite-fn-router';

export default async ({ req, res, log, error }) => {
  return await handleRequest(
    { req, res, log, error },
    (router) => {
      router.get('/', (req, res, log, error) => {
        return res.send('Hello, World!');
      });
      router.get('/foo', () => ({
        statusCode: 200,
        body: 'bar'
      }) satisfies AppwriteResponseObject<string>);
    },
    {
      cors: {
        allowedOrigins: [
          'https://my-domain.com'
          /.*\.subdomain\.somedomain\.tld$/, // you may use regex
        ],
        allowMethods: ['GET', 'POST', 'PUT'],
        allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
      },
    }
  );
};
```
