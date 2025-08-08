---
sidebar_position: 2
---

# `handleRequest`

## Philosophy: Familiar API, Enhanced Internals

Quand vous utilisez cette librairie, vos handlers reçoivent toujours quatre arguments : `req`, `res`, `log`, `error`. Cela correspond exactement à l’API Appwrite standard, donc l’adoption du routeur ne change ni votre modèle mental ni la structure de votre code.

**API simplifiée :** Le paramètre `req` est strictement un objet AppwriteRequest, sans fusion ni surcouche. L’API utilisateur reste donc 100% compatible Appwrite, sans surprise ni comportement caché. Le routeur utilise en interne un objet Request natif si besoin, mais cela ne concerne pas l’utilisateur.

**Note :** Si vous avez un besoin avancé d’accéder à l’objet Request natif (Web API), il peut être exposé en cinquième argument optionnel, mais ce n’est pas documenté pour l’utilisateur standard.

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

| Option     | Type                                                                                                  | Default     | Description                                                                                                                                                                                                                                                                                                |
| ---------- | ----------------------------------------------------------------------------------------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `globals`  | `boolean`                                                                                             | `true`      | If `true`, makes `log` and `error` available as global functions.                                                                                                                                                                                                                                          |
| `env`      | `boolean`                                                                                             | `true`      | If `true`, sets the `APPWRITE_FUNCTION_API_KEY` environment variable from the `x-appwrite-key` header.                                                                                                                                                                                                     |
| `log`      | `boolean`                                                                                             | `true`      | Enables or disables logging.                                                                                                                                                                                                                                                                               |
| `errorLog` | `boolean`                                                                                             | `true`      | Enables or disables error logging.                                                                                                                                                                                                                                                                         |
| `catch`    | `(err: unknown, req: AppwriteRequest, res: AppwriteResponse, log: Function, error: Function) => void` | `undefined` | Custom error handler called whenever an unhandled error occurs in any handler or middleware. Receives the error and the Appwrite context (`req`, `res`, `log`, `error`). Lets you log, report, or customize error handling globally. Note: the signature is adapted internally to match itty-router's API. |
| `cors`     | `object`                                                                                              | `{...}`     | Configuration for Cross-Origin Resource Sharing (CORS). See below for details.                                                                                                                                                                                                                             |

### Global error handling with `catch`

You can provide a custom error handler using the `catch` option. This callback is invoked whenever an unhandled error occurs in any route handler or middleware. It receives the error and the Appwrite context (`req`, `res`, `log`, `error`). Use it to log errors, send them to a monitoring service, or customize the error response globally.

**Note:** The signature is adapted internally to match itty-router's API, so you can always use `(err, req, res, log, error)` in your handler.

```typescript
import { handleRequest } from 'appwrite-fn-router';

export default async ({ req, res, log, error }) => {
  return await handleRequest(
    { req, res, log, error },
    (router) => {
      // Define your routes here
    },
    {
      catch: (err, req, res, log, error) => {
        // Custom error logging or reporting with full context
        log('Error intercepted by catch:', err);
        // You can also use req, res, error, etc.
      },
    }
  );
};
```

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
