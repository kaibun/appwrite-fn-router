import { createRouter } from '@kaibun/appwrite-fn-router';
import type { Widget } from '../../../../types/widget';

// Re-export for convenience
export type { Widget };

/**
 * Routes nested under /widgets/
 */
const router = createRouter({ base: '/widgets' });

// --- DÉMO PERSISTANTE EN MÉMOIRE ---
// Stockage en mémoire (reset à chaque redémarrage du serveur)
const widgets: Record<string, Widget> = {};
let nextId = 1;

// GET /widgets => Liste tous les widgets
router.get('/', (_req, res) => {
  return res.json({ items: Object.values(widgets) });
});

// POST /widgets => Crée un ou plusieurs widgets (bulk)
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
    const id = String(nextId++);
    const newWidget: Widget = {
      id,
      weight: body.weight,
      color: body.color as Widget['color'],
    };
    widgets[id] = newWidget;
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

router.delete('/', (req, res) => {
  const count = Object.keys(widgets).length;
  for (const id of Object.keys(widgets)) {
    delete widgets[id];
  }
  return res.json({ deleted: count });
});

router.post('/bulk', (req, res, _log, _error) => {
  const body = req.bodyJson;
  try {
    if (!Array.isArray(body)) {
      throw new SyntaxError('Expected an array of widgets to create');
    }
    const created: Widget[] = [];
    const errors: string[] = [];
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
      const id = String(nextId++);
      const newWidget: Widget = {
        id,
        weight: item.weight,
        color: item.color as Widget['color'],
      };
      widgets[id] = newWidget;
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
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const widget = widgets[id];
  if (!widget) {
    return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
  }
  return res.json(widget);
});

// PATCH /widgets/{id} => Met à jour un widget
router.patch('/:id', async (req, res, _log, _error) => {
  try {
    const { id } = req.params;
    const widget = widgets[id];
    if (!widget) {
      return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
    }
    const body = req.bodyJson as Partial<Widget>;
    const updatedWidget: Widget = {
      id,
      weight: body.weight ?? widget.weight,
      color: body.color ?? widget.color,
    };
    widgets[id] = updatedWidget;
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
    throw e;
  }
});

// DELETE /widgets/{id} => Supprime un widget
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  if (!widgets[id]) {
    return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
  }
  delete widgets[id];
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
