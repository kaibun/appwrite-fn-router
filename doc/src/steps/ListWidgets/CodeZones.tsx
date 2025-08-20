// Zones d’explication pour l’étape 3 : GET /widgets
import React from 'react';

export const codeZones = [
  {
    id: 'client',
    title: 'Configuration du client Appwrite',
    content: (
      <>
        <strong>Client Appwrite</strong>
        <p>
          Cette zone configure le client Appwrite avec l’endpoint, le projet et
          la clé API via les variables d’environnement.
        </p>
      </>
    ),
  },
  {
    id: 'databases',
    title: 'Initialisation des bases de données',
    content: (
      <>
        <strong>Databases</strong>
        <p>
          Création de l’instance Appwrite Databases pour interagir avec les
          collections.
        </p>
      </>
    ),
  },
  {
    id: 'route',
    title: 'Route GET /widgets',
    content: (
      <>
        <strong>Route GET /widgets</strong>
        <p>
          Cette route récupère la liste des widgets depuis la collection
          Appwrite et la retourne au format JSON.
        </p>
      </>
    ),
  },
];
