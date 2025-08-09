// Configuration centralisée pour les URLs de TriggerFunction

export const TRIGGER_API_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : 'https://cloud.appwrite.io/v1/functions/TEST_ID_HERE/executions'; // À adapter pour la prod
