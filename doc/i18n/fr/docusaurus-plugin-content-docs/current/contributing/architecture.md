---
sidebar_position: 3
title: Architecture et build
---

# Architecture et Build

Ce document explique l'architecture du projet, les choix techniques et le fonctionnement du processus de build et de test. Comprendre ces éléments est essentiel pour contribuer efficacement au projet.

## Workspaces NPM et Monorepo

Le projet est structuré comme un monorepo géré avec les [workspaces NPM](https://docs.npmjs.com/cli/v10/using-npm/workspaces). Cette approche permet de développer la librairie principale `@kaibun/appwrite-fn-router` et les fonctions d'exemple (comme `functions/Test`) dans un seul et même dépôt, tout en les maintenant comme des paquets distincts.

### Avantages

- **Développement Simplifié** : Les modifications sur la librairie principale sont immédiatement disponibles dans les fonctions de test sans avoir à publier le paquet sur NPM.
- **Dépendances Centralisées** : Les dépendances de développement (comme TypeScript, Prettier, etc.) sont gérées à la racine du projet.
- **Cohérence** : Assure que la librairie et ses exemples sont toujours synchronisés.

### Configuration

1.  **`package.json` (racine)** :
    - La propriété `"workspaces": ["functions/*"]` déclare que chaque sous-dossier dans `functions/` est un paquet du workspace.
    - La propriété `"exports"` est configurée pour exposer correctement les points d'entrée du module (`.`) et les types (`./types`), ce qui est crucial pour la résolution de modules par TypeScript et Node.js.

2.  **`functions/Test/package.json`** :
    - La dépendance à la librairie principale est déclarée avec `"@kaibun/appwrite-fn-router": "workspace:*"`. NPM remplace `*` par la version locale de la librairie, créant un lien symbolique.

## Processus de Build avec `tsup`

Nous utilisons [`tsup`](https://tsup.egoist.dev/) pour compiler notre code TypeScript.

### Build de la Librairie Principale

La configuration `tsup` dans le `package.json` à la racine compile `src/main.ts` en un module ESM et génère les fichiers de déclaration de types (`.d.ts`).

### Build des Fonctions (ex: `Test`)

Le build des fonctions est plus subtil en raison de l'environnement d'exécution des fonctions Appwrite (un conteneur Docker).

- **Problème** : L'environnement Docker ne comprend pas les liens symboliques des workspaces NPM. Une simple copie de `functions/Test` dans le conteneur résulterait en une erreur `ERR_MODULE_NOT_FOUND` car le paquet `@kaibun/appwrite-fn-router` serait introuvable.
- **Solution** : Nous devons "bundler" (inclure) le code de la librairie directement dans le fichier de sortie de la fonction.
- **Configuration** : Dans `functions/Test/package.json`, la configuration `tsup` contient :
  - `"bundle": true` : Active le bundling.
  - `"noExternal": ["@kaibun/appwrite-fn-router"]` : Force `tsup` à inclure ce paquet dans le build final au lieu de le traiter comme une dépendance externe.
  - `"external": ["node-appwrite"]` : Le SDK `node-appwrite` est déjà disponible dans l'environnement d'exécution Appwrite, nous l'excluons donc du bundle.

## Configuration TypeScript

Une configuration TypeScript soignée est essentielle pour que l'éditeur (VS Code), le compilateur (`tsc`) et les outils de build fonctionnent harmonieusement.

- **`tsconfig.base.json`** : C'est notre configuration de base, partagée par tous les paquets.
  - `"moduleResolution": "bundler"` : Mode de résolution de module moderne qui fonctionne bien avec les outils de build comme `tsup`.
  - `"baseUrl": "."` et `"paths"` : Ces options sont **cruciales**. Elles permettent de créer des alias de chemin. Par exemple, `"@/*": ["./*"]` permet d'utiliser des imports comme `import type { Widget } from '@/types/widget'` depuis n'importe où dans le projet. Cela résout les erreurs "module introuvable" dans l'éditeur et est utilisé par Cypress.

- **`cypress/tsconfig.json`** : Cypress a besoin de son propre `tsconfig.json`.
  - Il étend le `tsconfig.json` principal.
  - Il ajoute les types globaux de Cypress (`"types": ["cypress", "node"]`). Sans cela, TypeScript ne reconnaîtrait pas les commandes comme `describe`, `it`, `cy`, etc.

## Tests End-to-End avec Cypress

Cypress est configuré pour tester l'API de la fonction en cours d'exécution :

```sh
npm run test
```

- **Problème** : Par défaut, Cypress ne comprend pas les alias de chemin TypeScript de notre `tsconfig.json`.
- **Solution** : Nous utilisons `@cypress/webpack-preprocessor` pour intercepter les fichiers de test et les compiler avec une configuration Webpack personnalisée qui résout les alias.

### `cypress.config.ts`

Le fichier de configuration de Cypress contient la logique la plus complexe :

1.  **`setupNodeEvents`** : Cette fonction configure l'environnement d'exécution Node.js de Cypress.
2.  **Webpack Preprocessor** : Nous lui indiquons d'utiliser `webpackPreprocessor`.
3.  **Configuration Webpack** :
    - `resolve.alias`: Nous recréons l'alias `@` en utilisant `path.resolve(config.projectRoot)`. On utilise `config.projectRoot` car les variables comme `__dirname` ne sont pas disponibles dans les modules ES.
    - `ts-loader`: Nous utilisons `ts-loader` pour que Webpack puisse compiler les fichiers TypeScript.
4.  **Modules ES** : Le fichier `cypress.config.ts` est un module ES. Il faut donc utiliser `import` au lieu de `require()`.

Avec cette architecture, le projet est robuste, facile à maintenir et offre une excellente expérience de développement.
