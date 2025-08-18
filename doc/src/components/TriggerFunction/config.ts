// Config for TriggerFunction’s URL.

export const TRIGGER_API_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : // TODO: adjust to actual production value
      'https://cloud.appwrite.io/v1/functions/TEST_ID_HERE/executions';
