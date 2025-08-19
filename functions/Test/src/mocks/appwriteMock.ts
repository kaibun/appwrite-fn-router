/**
 * Minimal Appwrite’s Node.js SDK mock (databases), with in-memory persistence.
 * Used for testing routes as if using the real Appwrite SDK.
 *
 * @see https://appwrite.io/docs/references/cloud/server-nodejs/databases
 */

export type Widget = {
  $id: string;
  name: string;
  [key: string]: any;
};

// In-memory persistence.
const widgets: Record<string, Widget> = {};

class MockClient {
  private endpoint = '';
  private project = '';
  private key = '';

  setEndpoint(endpoint: string) {
    this.endpoint = endpoint;
    return this;
  }
  setProject(project: string) {
    this.project = project;
    return this;
  }
  setKey(key: string) {
    this.key = key;
    return this;
  }
}

class MockDatabases {
  constructor(client: MockClient) {
    // Nothing to do here, just for type compatibility
  }
  async listDocuments(databaseId: string, collectionId: string) {
    return { documents: Object.values(widgets) };
  }
  async createDocument(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: any
  ) {
    const widget: Widget = { $id: documentId, ...data };
    widgets[documentId] = widget;
    return widget;
  }
  async getDocument(
    databaseId: string,
    collectionId: string,
    documentId: string
  ) {
    const widget = widgets[documentId];
    if (!widget) throw new Error('Document not found');
    return widget;
  }
  async updateDocument(
    databaseId: string,
    collectionId: string,
    documentId: string,
    data: any
  ) {
    if (!widgets[documentId]) throw new Error('Document not found');
    widgets[documentId] = { ...widgets[documentId], ...data };
    return widgets[documentId];
  }
  async deleteDocument(
    databaseId: string,
    collectionId: string,
    documentId: string
  ) {
    if (!widgets[documentId]) throw new Error('Document not found');
    delete widgets[documentId];
    return { $id: documentId };
  }
  async deleteDocuments(
    databaseId: string,
    collectionId: string,
    queries?: any
  ) {
    Object.keys(widgets).forEach((id) => delete widgets[id]);
    return { deleted: true };
  }
}

export default {
  Client: MockClient,
  Databases: MockDatabases,
};
