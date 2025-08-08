import { createRouter } from '@kaibun/appwrite-fn-router';

/**
 * Routes nested under /errors
 */
const router = createRouter({ base: '/errors' });

// GET /errors/throw => Test router’s root error handler by throwing an Error
router.get('/throw', (_req, res, log, _error) => {
  throw new Error('E2E: This is a test error from /throw');
});

export default router;
