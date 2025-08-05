import { createRouter } from '../lib/main.ts';

/**
 * Routes nested under /widgets/
 */
const router = createRouter({ base: '/widgets' });

// GET /widgets => Fetch all widgets
router.get('/', (_request, _req, res, log, _error) => {
  const response = res.text('TODO: Fetch all widgets');
  return response;
});

export default router;
