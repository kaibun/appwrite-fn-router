---
sidebar_position: 2
---

# `handleRequest`

The `handleRequest` function is the main entry point for your Appwrite function when using this router. It sets up the environment, initializes the router with your routes and configuration, and handles incoming requests.

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

The `options` object allows you to configure various aspects of the router and its surrounding execution environment:

| Option     | Type                     | Default     | Description                                                                                            |
| ---------- | ------------------------ | ----------- | ------------------------------------------------------------------------------------------------------ |
| `globals`  | `boolean`                | `true`      | If `true`, makes `log` and `error` available as global functions.                                      |
| `env`      | `boolean`                | `true`      | If `true`, sets the `APPWRITE_FUNCTION_API_KEY` environment variable from the `x-appwrite-key` header. |
| `log`      | `boolean`                | `true`      | Enables or disables logging.                                                                           |
| `errorLog` | `boolean`                | `true`      | Enables or disables error logging.                                                                     |
| `onError`  | `(err: unknown) => void` | `undefined` | A custom error handler function.                                                                       |
| `cors`     | `object`                 | `{...}`     | Configuration for Cross-Origin Resource Sharing (CORS). See below for details.                         |

## CORS Configuration

You can provide a flexible CORS configuration to control how your function responds to requests from different origins.

The `cors` option object has the following properties:

- `allowedOrigins`: An array of strings or `RegExp` objects for allowed origins.
- `allowMethods`: An array of allowed HTTP methods.
- `allowHeaders`: An array of allowed request headers.

### Example

Here is how you can configure CORS to allow requests from your production domain and any Appwrite function subdomain for a specific region, while also defining specific methods and headers.

```typescript
// src/main.ts
import { handleRequest } from 'appwrite-fn-router';

export default async ({ req, res, log, error }) => {
  return await handleRequest(
    { req, res, log, error },
    (router) => {
      // Define your routes here
      router.get('/', () => ({ message: 'Hello World!' }));
    },
    {
      cors: {
        allowedOrigins: [
          'https://my-domain.com',
          /.*\.my-region\.appwrite\.run$/, // e.g., for the region of your choice
        ],
        allowMethods: ['GET', 'POST', 'PUT'],
        allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
      },
    }
  );
};
```

**Note:** For local development, `http://localhost:3001` (the [Test function](https://github.com/kaibun/appwrite-fn-router/tree/main/functions/Test)) and `https://localhost:3001` ([this very Docusaurus process](https://github.com/kaibun/appwrite-fn-router/tree/main/doc)) are automatically added to the `allowedOrigins` list, granted `NODE_ENV` is not set to `production`. This allows for sending CORS request between localhost ports.
