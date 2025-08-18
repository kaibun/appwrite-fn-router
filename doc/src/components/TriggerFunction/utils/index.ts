/**
 * Returns true if the header is a CORS "simple header" (safelisted).
 *
 * Simple headers are defined by the Fetch spec:
 * https://fetch.spec.whatwg.org/#simple-header
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests
 *
 * Only these headers are considered simple:
 *   - Accept
 *   - Accept-Language
 *   - Content-Language
 *   - Content-Type (only if value is one of:
 *       application/x-www-form-urlencoded, multipart/form-data, text/plain)
 *
 * Additionally, the value must be <= 128 bytes (UTF-8 length).
 * All other headers are considered non-simple and require explicit CORS
 * configuration.
 */
export function isCorsSimpleHeader(key: string, value: string): boolean {
  if (new TextEncoder().encode(value).length > 128) return false;
  const k = key.trim().toLowerCase();
  if (k === 'accept' || k === 'accept-language' || k === 'content-language')
    return true;
  if (k === 'content-type') {
    const v = value.trim().toLowerCase();
    return (
      v === 'application/x-www-form-urlencoded' ||
      v === 'multipart/form-data' ||
      v === 'text/plain'
    );
  }
  return false;
}

/**
 * Extracts named route parameters (e.g. :id) from a URL pattern, but ignores
 * port numbers (e.g. :3000).
 *
 * Only matches :param where param starts with a letter or underscore, and is
 * not a number (so :3000 is ignored).
 *
 * Example:
 *
 * - /widgets/:id                      => ['id']
 * - /api/:foo/:bar                    => ['foo', 'bar']
 * - http://localhost:3000/widgets/:id => ['id'] (does not match :3000)
 */
export function extractParams(url: string): string[] {
  // Only match :param where param starts with a letter or underscore
  const matches = url.match(/:([a-zA-Z_][a-zA-Z0-9_]*)/g);
  return matches ? matches.map((m) => m.slice(1)) : [];
}
