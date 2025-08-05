import { createRouter } from '../lib/main.ts';

/**
 * Routes nested under /widgets/
 */
const router = createRouter({ base: '/widgets' });

// GET /widgets => Fetch all widgets
router.get('/', (_request, _req, res, log, _error) => {
  const response = res.json({
    items: [
      { id: '1ab0', weight: 1, color: 'red' },
      { id: '2cd9', weight: 1, color: 'blue' },
    ],
  });
  return response;
});

export default router;
