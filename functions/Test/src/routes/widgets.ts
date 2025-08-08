import { createRouter } from '@kaibun/appwrite-fn-router';
import type { Widget } from '../../../../types/widget';

// Re-export for convenience
export type { Widget };

/**
 * Routes nested under /widgets/
 */
const router = createRouter({ base: '/widgets' });

// GET /widgets => List widgets
router.get('/', (_req, res, _log, _error) => {
  const response = res.json({
    items: [
      { id: 'widget1', weight: 10, color: 'red' },
      { id: 'widget2', weight: 20, color: 'blue' },
    ],
  });
  return response;
});

// POST /widgets => Create a widget
router.post('/', async (req, res, _log, _error) => {
  try {
    const body = req.bodyJson as Partial<Widget>;
    if (typeof body.weight !== 'number' || !body.color) {
      return res.json(
        {
          code: 'VALIDATION_ERROR',
          message: 'Missing required fields',
          errors: ['weight and color are required'],
        },
        400
      );
    }
    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      weight: body.weight,
      color: body.color,
    };
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
    return res.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      500
    );
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

// GET /widgets/{id} => Read a specific widget
router.get('/:id', (req, res, _log, _error) => {
  const { id } = req.params;
  if (id === 'not-found') {
    return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
  }
  return res.json({ id, weight: 10, color: 'red' });
});

// PATCH /widgets/{id} => Update a widget
router.patch('/:id', async (req, res, _log, _error) => {
  try {
    const { id } = req.params;
    if (id === 'not-found') {
      return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
    }
    const body = req.bodyJson as Partial<Widget>;
    const updatedWidget: Widget = {
      id,
      weight: body.weight ?? 10,
      color: body.color ?? 'red',
    };
    return res.json(updatedWidget);
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
    return res.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred',
      },
      500
    );
  }
});

// DELETE /widgets/{id} => Delete a widget
router.delete('/:id', (req, res, _log, _error) => {
  const { id } = req.params;
  if (id === 'not-found') {
    return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
  }
  return res.send('', 204);
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
