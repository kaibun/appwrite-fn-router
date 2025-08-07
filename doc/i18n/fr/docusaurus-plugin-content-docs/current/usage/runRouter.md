---
sidebar_position: 4
---

# `runRouter`

La fonction `runRouter` est responsable de l'exécution du routeur par rapport à une requête entrante de l'environnement Appwrite. Elle construit un objet [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) standard à partir du contexte Appwrite et le transmet à la [méthode `fetch` du routeur](https://itty.dev/itty-router/concepts#whatever-you-pass-to-router-fetch-goes-to-the-handlers).

Cette fonction est appelée en interne par `handleRequest` une fois que le routeur a été configuré et que vos routes ont été attachées.

## Signature

```typescript
async function runRouter(
  router: ReturnType<typeof createRouter>,
  context: AppwriteContext,
  log: DefaultLogger,
  error: ErrorLogger
): Promise<AppwriteResponseObject>;
```

- `router` : Une instance du routeur créée avec `createRouter`.
- `context` : Le contexte de la fonction Appwrite (`req`, `res`, `log`, `error`).
- `log` : L'instance du logger (soit l'original d'Appwrite, soit une version muette).
- `error` : L'instance du logger d'erreurs.

## Utilisation

En général, vous n'avez pas besoin d'appeler `runRouter` directement, car `handleRequest` s'en charge pour vous. La séparation existe pour maintenir la logique de configuration dans `handleRequest` distincte de la logique d'exécution dans `runRouter`.

Cependant, si vous deviez l'utiliser manuellement, cela ressemblerait à quelque chose comme ceci :

```typescript
import { createRouter, runRouter } from 'appwrite-fn-router';

export default async (context) => {
  const { log, error } = context;

  const router = createRouter();
  router.get('/', () => ({ message: 'Exécution manuelle du routeur !' }));

  // Vous auriez besoin de répliquer la logique de configuration de handleRequest ici
  // (par ex., CORS, configuration de l'environnement, conversions de types, etc.)
  // Ne faites pas ça. Utilisez cette bibliothèque !

  const response = await runRouter(router, context, log, error);

  return response;
};
```
