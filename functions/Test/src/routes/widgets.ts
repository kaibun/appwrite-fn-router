import { createRouter } from '@kaibun/appwrite-fn-router';
import type { Widget } from '../../../../types/widget';

// Re-export for convenience
export type { Widget };

/**
 * Routes nested under /widgets/
 */
const router = createRouter({ base: '/widgets' });

// --- DÉMO PERSISTANTE EN MÉMOIRE ---
// Utilisation du mock Appwrite en ESM
import sdk from '../mocks/appwriteMock';

const client = new sdk.Client()
  .setEndpoint('https://mock-endpoint')
  .setProject('mock-project')
  .setKey('mock-key');
const databases = new sdk.Databases(client);

// Config locale pour le mock
const MOCK_DB_ID = 'mock-db';
const MOCK_COLLECTION_ID = 'mock-collection';

// GET /widgets => Liste tous les widgets
router.get('/', async (_req, res) => {
  const result = await databases.listDocuments(MOCK_DB_ID, MOCK_COLLECTION_ID);
  return res.json({ items: result.documents });
});

// POST /widgets => Crée un widget
router.post('/', async (req, res, _log, _error) => {
  try {
    const body = req.bodyJson;
    if (
      typeof body.weight !== 'number' ||
      !body.color ||
      !['red', 'blue', 'gold'].includes(String(body.color))
    ) {
      return res.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          errors: ['weight and color (red|blue|gold) are required'],
        },
        400
      );
    }
    const id = String(Date.now());
    const newWidget = await databases.createDocument(
      MOCK_DB_ID,
      MOCK_COLLECTION_ID,
      id,
      { weight: body.weight, color: body.color }
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

// DELETE /widgets => Supprime tous les widgets
router.delete('/', async (_req, res) => {
  await databases.deleteDocuments(MOCK_DB_ID, MOCK_COLLECTION_ID);
  return res.json({ deleted: true });
});

// POST /widgets/bulk => Crée plusieurs widgets
router.post('/bulk', async (req, res, _log, _error) => {
  const body = req.bodyJson;
  try {
    if (!Array.isArray(body)) {
      throw new SyntaxError('Expected an array of widgets to create');
    }
    const created = [];
    const errors = [];
    for (const item of body) {
      if (
        typeof item.weight !== 'number' ||
        !item.color ||
        !['red', 'blue', 'gold'].includes(String(item.color))
      ) {
        errors.push(
          'weight and color (red|blue|gold) are required for all items'
        );
        continue;
      }
      const id = String(Date.now() + Math.random());
      const newWidget = await databases.createDocument(
        MOCK_DB_ID,
        MOCK_COLLECTION_ID,
        id,
        { weight: item.weight, color: item.color }
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

// GET /widgets/secret => Accessing the daily secret widget (requires Bearer token)
router.get('/secret', (req, res, _log, _error) => {
  const authHeader =
    req.headers['Authorization'] || req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ code: 'UNAUTHORIZED', message: 'Unauthorized' }, 401);
  }
  return res.json({ id: 'widget-secret', weight: 200, color: 'gold' });
});

// GET /widgets/{id} => Lire un widget spécifique
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

// PATCH /widgets/{id} => Met à jour un widget
router.patch('/:id', async (req, res, _log, _error) => {
  try {
    const { id } = req.params;
    const body = req.bodyJson;
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

// DELETE /widgets/{id} => Supprime un widget
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
