---
sidebar_position: 2
---

# `handleRequest`

La fonction `handleRequest` est le point d'entrée principal de votre fonction Appwrite lorsque vous utilisez ce routeur. Elle configure l'environnement, initialise le routeur avec vos routes et votre configuration, et gère les requêtes entrantes.

C'est probablement la seule méthode que vous aurez besoin d'appeler pour utiliser cette bibliothèque.

## Signature

```typescript
async function handleRequest(
  context: AppwriteContext,
  withRouter: (router: ReturnType<typeof createRouter>) => void,
  options?: Options
): Promise<AppwriteResponseObject | undefined>;
```

### Paramètres

- `context` : L’objet contexte standard d’une fonction Appwrite (`{ req, res, log, error }`).
- `withRouter` : Une fonction de rappel où vous définissez toutes vos routes en utilisant les méthodes d’[itty-router](https://itty.dev/itty-router/getting-started#_3-register-routes) sur l’instance [`Router`](https://itty.dev/itty-router/api#router) fournie.
- `options` : Un objet de configuration optionnel pour personnaliser le comportement d’AFR et de son routeur interne.

### Valeur de retour

Une promesse d’[AppwriteResponseObject](/api/modules/types#responseobject) ou le littéral `undefined`. La fonction peut lever une exception.

## Options

L’objet `options` permet de configurer divers aspects du routeur :

| Option    | Type                                                                                                          | Par défaut                                                     | Description                                                                                                                                                                                                                                                                                   |
| --------- | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `globals` | `boolean`                                                                                                     | `true`                                                         | Si `true`, promeut certaines variables en globales, comme `log` et `error`.                                                                                                                                                                                                                   |
| `env`     | `boolean`                                                                                                     | `true`                                                         | Si `true`, promeut certains headers en variables d’environnement, comme `x-appwrite-key` devenant `APPWRITE_FUNCTION_API_KEY`.                                                                                                                                                                |
| `logs`    | `boolean \| (mode: "log" \| "errorLog") => boolean`                                                           | `true` si `NODE_ENV` ou `APP_ENV` vaut "development" ou "test" | Active ou désactive les logs et logs d’erreur. Peut être un booléen ou une fonction callback recevant un mode (appelée deux fois, pour chaque mode). Par défaut, les logs sont activés uniquement en développement et test.                                                                   |
| `catch`   | `(err: unknown, req: AppwriteRequest, res: AppwriteResponse, log: DefaultLogger, error: ErrorLogger) => void` | `undefined`                                                    | Gestionnaire d’erreur personnalisé appelé à chaque erreur non gérée dans un handler ou middleware. Reçoit l’erreur et le contexte AFR (`req`, `res`, `log`, `error`). Permet de logger, reporter ou personnaliser la gestion d’erreur globalement. La signature est adaptée pour itty-router. |
| `cors`    | `object`                                                                                                      | `{...}`                                                        | Configuration du CORS (Cross-Origin Resource Sharing).                                                                                                                                                                                                                                        |

### Contrôle du logging avec `logs`

Vous pouvez contrôler globalement les logs via l’option `logs` :

- Un booléen (`true` ou `false`) pour activer/désactiver tous les logs (y compris les erreurs).
- Une fonction callback `(mode: "log" \| "errorLog") => boolean`, appelée deux fois par la librairie avec chaque mode, qui retourne `true` pour activer ce mode ou `false` pour le désactiver. Par défaut, les deux modes sont actifs en développement et test (`process.env.[APP_ENV|NODE_ENV] === ['development'|'test']`).

Exemple :

```typescript
handleRequest(
  context,
  (router) => {
    // ...
  },
  {
    // Active uniquement les logs d’erreur, et seulement si un header custom est présent.
    logs: (mode) => mode === 'errorLog' && req.headers['x-debug'] === '1',
  }
);
```

### Gestion globale des erreurs avec `catch`

Bien que AFR gère les erreurs par défaut avec une réponse 500 "Internal Server Error", vous pouvez fournir un gestionnaire personnalisé via l’option `catch`.

Ce callback est appelé à chaque erreur non gérée dans un handler ou middleware. Il reçoit l’erreur et un contexte AFR partiel (`req`, `res`, `log`, `error` mais pas `internals`). Utilisez-le pour logger, reporter ou personnaliser la réponse d’erreur globalement. Vous pouvez aussi relancer l’erreur pour déclencher le handler par défaut d’AFR.

```typescript
handleRequest(
  { req, res, log, error },
  (router) => {
    // ...
  },
  {
    catch: (err, req, res, log, error) => {
      // Logging ou reporting personnalisé.
      log('Erreur interceptée par catch :', err);
      // Vous pouvez aussi utiliser req, res, error, etc.
    },
  }
);
```

### Configuration CORS avec `cors`

Vous pouvez configurer finement le CORS pour contrôler comment votre fonction répond aux requêtes provenant d’autres origines.

L’objet `cors` accepte les propriétés suivantes :

- `allowedOrigins` : Un tableau de chaînes ou de RegExp pour les origines autorisées.
- `allowMethods` : Un tableau des méthodes HTTP autorisées.
- `allowHeaders` : Un tableau des headers autorisés.

:::note

Pour un développement local plus fluide, en environnement "development" ou "test", `http://localhost:3000` (ex : [Test Function](https://github.com/kaibun/appwrite-fn-router/tree/main/functions/Test)) et `https://localhost:3001` (ex : [Docusaurus](https://github.com/kaibun/appwrite-fn-router/tree/main/doc)) sont automatiquement ajoutés à la liste des origines autorisées. Cela permet d’envoyer des requêtes CORS entre ports localhost.

:::

## Exemple

Voici comment utiliser `handleRequest`, y compris la configuration CORS pour autoriser votre domaine de production. Attention, `handleRequest` est une fonction asynchrone, il faut donc toujours l’`await` (et généralement la `return`).

```typescript
import { handleRequest, AppwriteResponseObject } from 'appwrite-fn-router';

export default async ({ req, res, log, error }) => {
  return await handleRequest(
    { req, res, log, error },
    (router) => {
      router.get('/', (req, res, log, error) => {
        return res.send('Hello, World!');
      });
      router.get(
        '/foo',
        () =>
          ({
            statusCode: 200,
            body: 'bar',
          }) satisfies AppwriteResponseObject<string>
      );
    },
    {
      cors: {
        allowedOrigins: [
          'https://mon-domaine.com',
          /.*\.subdomain\.somedomain\.tld$/,
        ],
        allowMethods: ['GET', 'POST', 'PUT'],
        allowHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
      },
    }
  );
};
```
