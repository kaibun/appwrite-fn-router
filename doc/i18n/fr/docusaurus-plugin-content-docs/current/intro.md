---
title: ''
slug: /
sidebar_position: 1
---

<h1 style={{display: 'flex', alignItems: 'center', gap: '0.5em'}}>
  <img src="/fr/img/afr-logo-maze.png" alt="Logo" style={{height: '2.2em', marginRight: '0.2em', verticalAlign: 'middle'}} />
  <p style={{margin: 0}}>Appwrite Function Router</p>
</h1>

**Cette bibliothèque est un wrapper pour le [`Router` d'Itty](https://itty.dev/itty-router/concepts), adapté aux contraintes de l'implémentation [FaaS d'Appwrite](https://appwrite.io/docs/products/functions/develop).**

---

Les [Fonctions Appwrite](https://appwrite.io/products/functions) sont un moyen puissant de renforcer votre logique backend, mais elles ne disposent pas d'un système de routage intégré.

Pour cette raison, la gestion de différents chemins d'URL ou méthodes HTTP nécessite souvent des blocs if/else complexes, qui peuvent rapidement devenir difficiles à maintenir, au point de vous décourager. Pourtant, une fonction n’a pas nécessairement vocation à être atomique ; il existe de nombreux cas d'utilisation et de raisons justifiant la création d’une fonction avec plusieurs points de terminaison : économiser sur les coûts d'exécution, consolider une surface d'API, améliorer la maintenabilité, etc.

Cette bibliothèque résout ce problème en apportant une couche de routage simple mais puissante à vos fonctions Appwrite. Elle embarque le routeur léger d’[itty-router](https://itty.dev/itty-router/), vous permettant de définir des routes claires et déclaratives pour vos fonctions.

La bibliothèque gère automatiquement la conversion entre le [contexte de fonction d'Appwrite](https://appwrite.io/docs/products/functions/develop#context-object) et les objets standard [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request)/[Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) utilisés par le routeur, afin que vous puissiez vous concentrer sur l'écriture de votre logique applicative. Elle s'occupe également des détails d'implémentation tels que la configuration CORS, les typages TypeScript, etc.

## En bref

```ts
// highlight-start
import type { Context, JSONObject, ResponseObject } from "appwrite-fn-router"
import { handleRequest } from "appwrite-fn-router";
import { myRouteHandler } from "./routes";
// highlight-end

// highlight-start
// Définir optionnellement un schéma de réponse JSON personnalisé :
type MyJSONResponse = {
  status: 'success' | 'error';
  message: string;
  error?: string;
} & JSONObject;
// highlight-end

// Cette fonction asynchrone est votre gestionnaire de fonction obligatoire standard d'Appwrite :
export default async (context: Context) => {
  // On peut exploiter les propriétés du contexte fournies par Appwrite si nécessaire :
  // const { req, res, log, error } = context;

  // Votre travail consiste à appeler handleRequest avec le contexte d'Appwrite,
  // et un rappel définissant les gestionnaires de route renvoyant les valeurs ResponseObject d'Appwrite
  // (généralement créées à l'aide des méthodes d'assistance res d'Appwrite).
  // highlight-next-line
  return handleRequest(context, (router) => {
    // Dans un gestionnaire de route, request est un objet Request natif, tandis que req est la
    // version spécifique de la requête d'Appwrite. Vous avez également accès au reste du
    // contexte de la fonction d'Appwrite : les objets res, log et error. Avoir tous
    // ces éléments comme arguments permet d'importer des gestionnaires de route définis en dehors
    // de cette fermeture (voir myRouteHandler ci-dessous).
    // highlight-start
    router.get('/hello', (request, req, res, log, error) => {
      return res.json({
        status: 'success',
        message: 'Bonjour, le monde !',
      }) satisfies ResponseObject<MyJSONResponse>;
    });
    // highlight-end

    // Un gestionnaire de route peut être asynchrone, tant qu'il renvoie finalement un
    // ResponseObject d'Appwrite.
    // highlight-start
    router.post('/data', async (request, req, res, log, error) => {
      const data = await req.bodyJson;
      return res.json({
        received: data,
      });
    });
  // highlight-end

    // Bien que défini en dehors de la fermeture, myRouteHandler a toujours
    // accès au contexte de la fonction, via ses paramètres. C'est pratique !
    // highlight-start
    router.get("/mystery", myRouteHandler);
  }
  // highlight-end
);
```
