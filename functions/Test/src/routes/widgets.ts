import { createRouter } from '@kaibun/appwrite-fn-router';
import type { Widget } from '../../../../types/widget';
import { apiResponse, createApiResponder } from '../utils/apiResponse';

// Re-export for convenience
export type { Widget };

/**
 * All routes under /widgets/
 */
const router = createRouter({ base: '/widgets' });

// --- IN-MEMORY DEMO ---
// Using the Appwrite mock in ESM
import sdk from '../mocks/appwriteMock';
import { WidgetSchema } from '../validation/widgetSchema';

const client = new sdk.Client()
  .setEndpoint('https://mock-endpoint')
  .setProject('mock-project')
  .setKey('mock-key');
const databases = new sdk.Databases(client);

// Local config for the mock
const MOCK_DB_ID = 'mock-db';
const MOCK_COLLECTION_ID = 'mock-collection';

// GET /widgets => List all widgets
router.get('/', async (_req, res) => {
  const respond = createApiResponder(res);
  const result = await databases.listDocuments(MOCK_DB_ID, MOCK_COLLECTION_ID);
  return respond({
    code: 'SUCCESS',
    message: 'Widgets fetched',
    data: { items: result.documents },
  });
});

// POST /widgets => Create a widget
router.post('/', async (req, res, _log, _error) => {
  const respond = createApiResponder(res);
  try {
    const body = req.bodyJson;
    const id = String(Date.now());
    // Example: check for $id conflict (409)
    const existing = (
      await databases.listDocuments(MOCK_DB_ID, MOCK_COLLECTION_ID)
    ).documents.find((w: Widget) => w.$id === id);
    if (existing) {
      return respond({
        code: 'CONFLICT',
        message: `A widget with $id '${id}' already exists`,
        status: 409,
      });
    }
    const widgetCandidate = {
      $id: id,
      $collectionId: MOCK_COLLECTION_ID,
      $databaseId: MOCK_DB_ID,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $sequence: Date.now(),
      weight: body.weight,
      color: body.color,
    };
    const parseResult = WidgetSchema.safeParse(widgetCandidate);
    if (!parseResult.success) {
      return respond({
        code: 'VALIDATION_ERROR',
        message: 'Invalid widget data',
        errors: parseResult.error.issues.map((e) => e.message),
        status: 400,
      });
    }
    const newWidget = await databases.createDocument(
      MOCK_DB_ID,
      MOCK_COLLECTION_ID,
      id,
      body
    );
    return respond({
      code: 'SUCCESS',
      message: 'Widget created',
      data: newWidget,
      status: 201,
    });
  } catch (e) {
    if (e instanceof SyntaxError) {
      return respond({
        code: 'BAD_REQUEST',
        message: 'Invalid JSON in request body',
        status: 400,
      });
    }
    _error(String(e));
    throw e;
  }
});

// DELETE /widgets => Delete all widgets
router.delete('/', async (_req, res) => {
  const respond = createApiResponder(res);
  await databases.deleteDocuments(MOCK_DB_ID, MOCK_COLLECTION_ID);
  return respond({
    code: 'SUCCESS',
    message: 'All widgets deleted',
    data: { deleted: true },
  });
});

// POST /widgets/bulk => Create multiple widgets
router.post('/bulk', async (req, res, _log, _error) => {
  const respond = createApiResponder(res);
  const body = req.bodyJson;
  try {
    if (!Array.isArray(body)) {
      throw new SyntaxError('Expected an array of widgets to create');
    }
    const created = [];
    const errors = [];
    for (const item of body) {
      const id = String(Date.now() + Math.random());
      const widgetCandidate = {
        $id: id,
        $collectionId: MOCK_COLLECTION_ID,
        $databaseId: MOCK_DB_ID,
        $createdAt: new Date().toISOString(),
        $updatedAt: new Date().toISOString(),
        $permissions: [],
        $sequence: Date.now(),
        weight: item.weight,
        color: item.color,
      };
      const parseResult = WidgetSchema.safeParse(widgetCandidate);
      if (!parseResult.success) {
        errors.push(...parseResult.error.issues.map((e) => e.message));
        continue;
      }
      const newWidget = await databases.createDocument(
        MOCK_DB_ID,
        MOCK_COLLECTION_ID,
        id,
        item
      );
      created.push(newWidget);
    }
    if (created.length === 0) {
      return respond({
        code: 'VALIDATION_ERROR',
        message: 'No valid widgets to create',
        errors,
        status: 400,
      });
    }
    return respond({
      code: 'SUCCESS',
      message: 'Bulk widgets created',
      data: { items: created, errors },
      status: 201,
    });
  } catch (e) {
    if (e instanceof SyntaxError) {
      return respond({
        code: 'BAD_REQUEST',
        message: 'Invalid JSON in request body',
        status: 400,
      });
    }
    _error(String(e));
    throw e;
  }
});

// GET /widgets/secret => Access the daily secret widget (requires Bearer token)
router.get('/secret', (req, res, _log, _error) => {
  const respond = createApiResponder(res);
  const authHeader =
    req.headers['Authorization'] || req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return respond({
      code: 'UNAUTHORIZED',
      message: 'Unauthorized',
      status: 401,
    });
  }
  return respond({
    code: 'SUCCESS',
    message: 'Secret widget fetched',
    data: { $id: 'widget-secret', weight: 200, color: 'gold' },
  });
});

// GET /widgets/{id} => Get a specific widget
router.get('/:id', async (req, res) => {
  const respond = createApiResponder(res);
  const { id } = req.params;
  try {
    const widget = await databases.getDocument(
      MOCK_DB_ID,
      MOCK_COLLECTION_ID,
      id
    );
    return respond({
      code: 'SUCCESS',
      message: 'Widget fetched',
      data: widget,
    });
  } catch (e) {
    return respond({
      code: 'NOT_FOUND',
      message: 'Widget not found',
      status: 404,
    });
  }
});

// PATCH /widgets/{id} => Update a widget
router.patch('/:id', async (req, res, _log, _error) => {
  const respond = createApiResponder(res);
  try {
    const { id } = req.params;
    const body = req.bodyJson;
    const widgetCandidate = {
      $id: id,
      $collectionId: MOCK_COLLECTION_ID,
      $databaseId: MOCK_DB_ID,
      $createdAt: new Date().toISOString(),
      $updatedAt: new Date().toISOString(),
      $permissions: [],
      $sequence: Date.now(),
      weight: body.weight,
      color: body.color,
    };
    const parseResult = WidgetSchema.safeParse(widgetCandidate);
    if (!parseResult.success) {
      return respond({
        code: 'VALIDATION_ERROR',
        message: 'Invalid widget data',
        errors: parseResult.error.issues.map((e) => e.message),
        status: 400,
      });
    }
    const updatedWidget = await databases.updateDocument(
      MOCK_DB_ID,
      MOCK_COLLECTION_ID,
      id,
      body
    );
    return respond({
      code: 'SUCCESS',
      message: 'Widget updated',
      data: updatedWidget,
    });
  } catch (e) {
    if (e instanceof Error && e.message === 'Document not found') {
      return respond({
        code: 'NOT_FOUND',
        message: 'Widget not found',
        status: 404,
      });
    }
    if (e instanceof SyntaxError) {
      return respond({
        code: 'BAD_REQUEST',
        message: 'Invalid JSON in request body',
        status: 400,
      });
    }
    _error(String(e));
    throw e;
  }
});

// DELETE /widgets/{id} => Delete a widget
router.delete('/:id', async (req, res) => {
  const respond = createApiResponder(res);
  const { id } = req.params;
  try {
    await databases.deleteDocument(MOCK_DB_ID, MOCK_COLLECTION_ID, id);
    return respond({
      code: 'SUCCESS',
      message: 'Widget deleted',
      data: { deleted: true },
      status: 204,
    });
  } catch (e) {
    return respond({
      code: 'NOT_FOUND',
      message: 'Widget not found',
      status: 404,
    });
  }
});

// POST /widgets/{id} => Analyze a widget
router.post('/:id', (req, res, _log, _error) => {
  const respond = createApiResponder(res);
  const { id } = req.params;
  return respond({
    code: 'SUCCESS',
    message: 'Widget analyzed',
    data: {
      $id: id,
      analysis: 'This widget is amazing!',
    },
  });
});

export default router;
