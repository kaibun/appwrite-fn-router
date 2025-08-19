import { createRouter } from '@kaibun/appwrite-fn-router';
import type { Widget } from '../../../../types/widget';

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
  const result = await databases.listDocuments(MOCK_DB_ID, MOCK_COLLECTION_ID);
  return res.json({ items: result.documents });
});

// POST /widgets => Create a widget
router.post('/', async (req, res, _log, _error) => {
  try {
    const body = req.bodyJson;
    const id = String(Date.now());
    // Compose a full widget for validation
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
      return res.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid widget data',
          errors: parseResult.error.issues.map(
            (e: (typeof parseResult.error.issues)[0]) => e.message
          ),
        },
        400
      );
    }
    const newWidget = await databases.createDocument(
      MOCK_DB_ID,
      MOCK_COLLECTION_ID,
      id,
      body
    );
    return res.json(newWidget, 201);
  } catch (e) {
    if (e instanceof SyntaxError) {
      return res.json(
        {
          code: 'BAD_REQUEST',
          message: 'Invalid JSON in request body',
        },
        400
      );
    }
    _error(String(e));
    throw e;
  }
});

// DELETE /widgets => Delete all widgets
router.delete('/', async (_req, res) => {
  await databases.deleteDocuments(MOCK_DB_ID, MOCK_COLLECTION_ID);
  return res.json({ deleted: true });
});

// POST /widgets/bulk => Create multiple widgets
router.post('/bulk', async (req, res, _log, _error) => {
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
        errors.push(
          ...parseResult.error.issues.map(
            (e: (typeof parseResult.error.issues)[0]) => e.message
          )
        );
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
      return res.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'No valid widgets to create',
          errors,
        },
        400
      );
    }
    return res.json({ items: created, errors }, 201);
  } catch (e) {
    if (e instanceof SyntaxError) {
      return res.json(
        {
          code: 'BAD_REQUEST',
          message: 'Invalid JSON in request body',
        },
        400
      );
    }
    _error(String(e));
    throw e;
  }
});

// GET /widgets/secret => Access the daily secret widget (requires Bearer token)
router.get('/secret', (req, res, _log, _error) => {
  const authHeader =
    req.headers['Authorization'] || req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ code: 'UNAUTHORIZED', message: 'Unauthorized' }, 401);
  }
  return res.json({ id: 'widget-secret', weight: 200, color: 'gold' });
});

// GET /widgets/{id} => Get a specific widget
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const widget = await databases.getDocument(
      MOCK_DB_ID,
      MOCK_COLLECTION_ID,
      id
    );
    return res.json(widget);
  } catch (e) {
    return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
  }
});

// PATCH /widgets/{id} => Update a widget
router.patch('/:id', async (req, res, _log, _error) => {
  try {
    const { id } = req.params;
    const body = req.bodyJson;
    // Compose a full widget for validation
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
      return res.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'Invalid widget data',
          errors: parseResult.error.issues.map(
            (e: (typeof parseResult.error.issues)[0]) => e.message
          ),
        },
        400
      );
    }
    const updatedWidget = await databases.updateDocument(
      MOCK_DB_ID,
      MOCK_COLLECTION_ID,
      id,
      body
    );
    return res.json(updatedWidget);
  } catch (e) {
    if (e instanceof Error && e.message === 'Document not found') {
      return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
    }
    if (e instanceof SyntaxError) {
      return res.json(
        {
          code: 'BAD_REQUEST',
          message: 'Invalid JSON in request body',
        },
        400
      );
    }
    _error(String(e));
    throw e;
  }
});

// DELETE /widgets/{id} => Delete a widget
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await databases.deleteDocument(MOCK_DB_ID, MOCK_COLLECTION_ID, id);
    return res.send('', 204);
  } catch (e) {
    return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
  }
});

// POST /widgets/{id} => Analyze a widget
router.post('/:id', (req, res, _log, _error) => {
  const { id } = req.params;
  return res.json({
    statusCode: 200,
    id,
    analysis: 'This widget is amazing!',
  });
});

export default router;
