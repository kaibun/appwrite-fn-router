# Utilisation avancée

Cette page documente les aspects subtils ou avancés de la bibliothèque, à la fois pour les contributeurs et les utilisateurs avancés.

## Type réel de `req` dans les handlers & extensibilité

Bien que souvent référencé en tant que `AppwriteRequest`, l’objet reçu en premier argument dans les _route handlers_ et _middlewares_ est en réalité un `AFRRequest` : c’est une fusion de `AppwriteRequest` et du `IRequest` d’itty-router, qui permet de bien fonctionner avec ce dernier.

Cela signifie que des propriétés comme `params`, `route`, etc. sont disponibles à l’exécution, même si elles ne sont pas présentes dans le type de base `AppwriteRequest`. Cette fonctionnalité est fournie par [itty-router](https://itty.dev/itty-router/getting-started).

Vous pouvez étendre `AFRRequest` selon vos besoins, pour décrire des informations supplémentaires que vous passeriez dans l’objet `req` à vos callbacks.

```ts
// 1. Définissez votre type étendu
type MyRequest = AFRRequest & { user?: { id: string } };

// 2. Point d’entrée de votre fonction Appwrite
export default async function main(context) {
  // Vous pouvez enrichir req avec n’importe quelle propriété.
  const req = context.req as MyRequest;
  // Par exemple, attacher un objet user après authentification :
  req.user = { id: 'user-123' };

  // Passez le req enrichi (et le reste du contexte) à handleRequest
  return await handleRequest({ ...context, req }, (router) => {
    // L’accès aux paramètres d’URL est toujours possible.
    router.get('/:id', (req, res) => {
      const { id } = req.params;
      return res.json({ id });
    });

    // Et maintenant vous pouvez utiliser votre propriété personnalisée dans
    // votre handler, puisque req est du type MyRequest.
    router.get('/me', (req, res) => {
      if (!req.user) return res.json({ error: 'Non connecté' }, 401);
      return res.json({ userId: req.user.id });
    });
  });
}
```

## Normalisation globale des headers

Les headers sont automatiquement normalisés (clés insensibles à la casse) avant d’arriver dans les handlers. Cela signifie que vous pouvez toujours utiliser `req.headers['Authorization']` ou `req.headers['authorization']` de façon interchangeable dans vos handlers, quel que soit l’environnement (Node.js, Appwrite, etc.).

```ts
router.get('/secret', (req, res) => {
  const token = req.headers['Authorization'];
  // Identique à req.headers['authorization'], choisissez la forme que vous préférez.
  if (!token) return res.json({ error: 'Non autorisé' }, 401);
  return res.json({ secret: true });
});
```

## Le Cinquième Argument : `internals` (réservé à un usage avancé/interne)

Tous les callbacks/handlers (pas seulement les middlewares) reçoivent techniquement un cinquième argument, `internals`, qui expose une réplique de la requête native sous `internals.request`.

Cependant, il s’agit d’un détail interne d’itty-router et de la bibliothèque. L’objet `internals.request` n’est qu’une réplique approximative de la requête originale reçue par le runtime Appwrite (qui ne transmet pas la requête native à la fonction). **Il n’y a aucune raison pour les utilisateurs finaux de s’appuyer sur cet argument dans leur code ; il est uniquement utilisé en interne par la bibliothèque pour la gestion du CORS et des fonctionnalités similaires.**
