export interface HeaderConfig {
  key: string;
  value: string;
  enabled: boolean;
  corsEnabled: boolean;
  dynamic: boolean; // true if user-created, false if pre-created
  tainted?: boolean; // true if user manually toggled enabled
}

export const predefinedHeaders: HeaderConfig[] = [
  {
    key: 'Authorization',
    value: 'Bearer <token>',
    enabled: true,
    corsEnabled: true,
    dynamic: false,
    tainted: false,
  },
  // Add more predefined headers here if needed
];

// Config for TriggerFunction’s URL.
export const TRIGGER_API_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:3000'
    : // TODO: adjust to actual production value
      'https://cloud.appwrite.io/v1/functions/TEST_ID_HERE/executions';
