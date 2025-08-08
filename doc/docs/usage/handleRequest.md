---
sidebar_position: 2
---

# `handleRequest`

## Philosophy: Familiar API, Enhanced Internals

When you use this library, your route handlers always receive four arguments: `req`, `res`, `log`, and `error`. This matches exactly what you would get when writing a standard Appwrite function, so adopting the router does not change your mental model or code structure.

**Under the hood:** The `req` argument is a merged object that combines all properties and methods from both Appwrite's `req` and the native Web `Request` API. This allows the internal router (itty-router) to work seamlessly, while you, as a user, continue to interact with the familiar Appwrite context. The fact that `req` is "overloaded" with extra capabilities is an implementation detail—you can keep using it as you always have, but you also gain access to the full native `Request` API if you need it.

The `handleRequest` function is the main entry point for your Appwrite function when using this router. It sets up the environment, initializes the router with your routes and configuration, and handles incoming requests.

It’s likely the only method you’ll need to call to use this library.

## Signature

```typescript
async function handleRequest(
  context: AppwriteContext,
  withRouter: (router: ReturnType<typeof createRouter>) => void,
  options?: Options
): Promise<AppwriteResponseObject | undefined>;
```

- `context`: The standard Appwrite function context object (`req`, `res`, `log`, `error`).
- `withRouter`: A callback function where you define all your routes by calling methods on the provided `router` instance.
- `options`: An optional configuration object to customize the router's behavior.

## Options

The `options` object allows you to configure various aspects of the router:

| Option     | Type                     | Default     | Description                                                                                            |
| ---------- | ------------------------ | ----------- | ------------------------------------------------------------------------------------------------------ |
| `globals`  | `boolean`                | `true`      | If `true`, makes `log` and `error` available as global functions.                                      |
| `env`      | `boolean`                | `true`      | If `true`, sets the `APPWRITE_FUNCTION_API_KEY` environment variable from the `x-appwrite-key` header. |
| `log`      | `boolean`                | `true`      | Enables or disables logging.                                                                           |
| `errorLog` | `boolean`                | `true`      | Enables or disables error logging.                                                                     |
| `onError`  | `(err: unknown) => void` | `undefined` | A custom error handler function.                                                                       |
| `cors`     | `object`                 | `{...}`     | Configuration for Cross-Origin Resource Sharing (CORS). See below for details.                         |

### CORS Configuration

You can provide a flexible CORS configuration to control how your function responds to requests from different origins.

The `cors` option object has the following properties:

- `allowedOrigins`: An array of strings or `RegExp` objects for allowed origins.
- `allowMethods`: An array of allowed HTTP methods.
- `allowHeaders`: An array of allowed request headers.

## Example

Here is how you should use `handleRequest`, including the CORS configuration to allow requests from (in this example) your production domain.

```typescript
// src/main.ts
import { handleRequest } from 'appwrite-fn-router';

export default async ({ req, res, log, error }) => {
  return await handleRequest(
    { req, res, log, error },
    (router) => {
      // Define your routes here
      // Example:
      router.get('/', (req, res, log, error) => {
        return res.send('Hello, World!');
      });
      router.get('/', () => ({ message: 'Hello World!' }));
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

**Note:** For local development, `http://localhost:3000` (the [Test function](https://github.com/kaibun/appwrite-fn-router/tree/main/functions/Test)) and `https://localhost:3001` ([this very Docusaurus process](https://github.com/kaibun/appwrite-fn-router/tree/main/doc)) are automatically added to the `allowedOrigins` list, granted `NODE_ENV` is not set to `production`. This allows for sending CORS request between localhost ports.
