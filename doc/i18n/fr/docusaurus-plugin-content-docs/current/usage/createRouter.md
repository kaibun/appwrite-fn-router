---
sidebar_position: 3
---

# `createRouter`

La fonction `createRouter` est une fabrique qui renvoie une instance du [`Router`](https://itty.dev/itty-router/routers/) d'itty-router, spécialement conçue pour fonctionner dans l'[environnement d'exécution des fonctions Appwrite](https://appwrite.io/products/functions). C'est un routeur léger et puissant qui vous permet de définir des routes et de gérer les requêtes avec facilité.

Ce wrapper autour du `Router` d'itty-router est typé pour fonctionner de manière transparente dans le [contexte des fonctions Appwrite](https://appwrite.io/docs/products/functions/develop#context-object).

En général, vous n'avez pas besoin d'appeler `createRouter` vous-même, car une instance est créée pour vous et passée au rappel `withRouter` dans [`handleRequest`](./handleRequest.md). Toutefois, vous pourriez être amené à le faire si vous souhaitez vous organiser avec des routeurs imbriqués.

## Signature

```typescript
function createRouter(
  options?: RouterOptions<
    WrapperRequestType,
    [AppwriteRequest, AppwriteResponse, DefaultLogger, ErrorLogger] & any[]
  >
): Router<
  WrapperRequestType,
  [AppwriteRequest, AppwriteResponse, DefaultLogger, ErrorLogger] & any[],
  AppwriteResponseObject
>;
```

- `options` : Un objet de configuration facultatif d' `itty-router`. Vous pouvez l'utiliser pour définir un chemin de base pour toutes les routes, ou pour ajouter un middleware global (`before`, `finally`).

## Utilisation pour des routeurs imbriqués

`createRouter` est très utile pour créer des "sous-routeurs" imbriqués afin de mieux organiser vos routes.

Voici comment vous pouvez créer un sous-routeur pour un point de terminaison d'API `/categories` et l'attacher à votre routeur principal (les routeurs imbriqués respectent la configuration de leur parent racine, il n'est donc pas nécessaire de configurer CORS, etc. sauf si vous souhaitez une configuration spécifique pour cette partie de votre routage) :

**`src/routes/categories.ts`**

```typescript
import { createRouter } from 'appwrite-fn-router';

// 1. Créez un routeur avec un chemin de base.
//    Toutes les routes définies ici seront préfixées par /categories.
const categoriesRouter = createRouter({ base: '/categories' });

// Ceci gérera GET /categories
categoriesRouter.get('/', () => {
  return { message: 'Liste de toutes les catégories' };
});

// Ceci gérera GET /categories/123
categoriesRouter.get('/:id', (request) => {
  const { id } = request.params;
  return { message: `Détails de la catégorie ${id}` };
});

export default categoriesRouter;
```

**`src/main.ts`**

```typescript
import { handleRequest } from 'appwrite-fn-router';
import categoriesRouter from './routes/categories.ts';

export default async (context) => {
  await handleRequest(context, (mainRouter) => {
    mainRouter.get('/', () => ({ message: 'Ceci est le routeur principal' }));

    // 2. Attachez le sous-routeur.
    //    La méthode .all() transmet toute requête correspondant à /categories/*
    //    au categoriesRouter.
    mainRouter.all('/categories/*', categoriesRouter.fetch);
  });
};
```

Cette approche permet de garder votre code modulaire et plus facile à maintenir à mesure que votre API se développe.
