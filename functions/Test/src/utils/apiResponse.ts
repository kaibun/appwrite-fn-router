import type { AppwriteResponse } from '../../../../types/core';

/**
 * @packageDocumentation
 *
 * Utility for consistent API responses in all routes.
 *
 * Why use apiResponse?
 * - Centralizes response formatting for all API endpoints.
 * - Ensures every response (success or error) follows the same structure.
 * - Reduces code duplication: instead of many calls to res.json,
 *   we use a single function, making future changes easier.
 * - If the underlying response API (res.json) changes, only this
 *   function needs to be updated, not every route handler.
 * - Makes it easier for beginners to understand and maintain the code.
 * - Encourages best practices: clear codes, messages, and error handling.
 *
 * Advanced usage: binding res for less verbose handlers
 * ----------------------------------------------------
 * You can bind the response object to apiResponse using createApiResponder:
 *
 *   const respond = createApiResponder(res);
 *   respond({ code: 'SUCCESS', message: '...', data: ... });
 *
 * This reduces repetition and demonstrates closures in JS/TS.
 *
 * Another advanced technique is currying, which allows partial
 * application of arguments. See:
 * https://developer.mozilla.org/en-US/docs/Glossary/Currying
 */

export type ApiResponseOptions = {
  code: string;
  message: string;
  data?: any;
  errors?: string[];
  status?: number;
};

export function apiResponse(res: AppwriteResponse, opts: ApiResponseOptions) {
  const { code, message, data, errors, status } = opts;
  const body: Record<string, unknown> = { code, message };
  if (data !== undefined) body.data = data;
  if (errors && errors.length) body.errors = errors;
  return res.json(body, status ?? 200);
}

/**
 * Binds the response object to apiResponse for easier usage in handlers.
 * This demonstrates closures and reduces repetition in route code.
 */
export function createApiResponder(res: AppwriteResponse) {
  return (opts: ApiResponseOptions) => apiResponse(res, opts);
}
