import { describe, it, expect } from 'vitest';
import type { JSONObject, AppwriteRequest } from '../../types';

// Type guard to check if an object conforms to AppwriteRequest
function isAppwriteRequest(req: any): req is AppwriteRequest {
  return (
    req &&
    typeof req.url === 'string' &&
    typeof req.method === 'string' &&
    typeof req.headers === 'object' &&
    req.headers !== null &&
    typeof req.path === 'string' &&
    typeof req.host === 'string' &&
    (req.scheme === 'http' || req.scheme === 'https') &&
    typeof req.query === 'object' &&
    req.query !== null &&
    typeof req.queryString === 'string' &&
    typeof req.port === 'string' &&
    typeof req.body !== 'undefined' &&
    typeof req.bodyRaw === 'string' &&
    typeof req.bodyText === 'string' &&
    typeof req.bodyJson !== 'undefined' &&
    typeof req.bodyBinary !== 'undefined'
  );
}

describe('AppwriteRequest mock', () => {
  it('exposes all AppwriteRequest properties and getters', () => {
    const appwriteReq = {
      url: 'https://example.com/widgets/42?foo=bar',
      method: 'POST',
      headers: {
        Authorization: 'Bearer token',
        'Content-Type': 'application/json',
      },
      path: '/widgets/42',
      host: 'example.com',
      scheme: 'https',
      query: { foo: 'bar' },
      queryString: 'foo=bar',
      port: '443',
      get body(): JSONObject | string {
        return { foo: 'bar' };
      },
      get bodyRaw(): string {
        return JSON.stringify(this.body);
      },
      get bodyText(): string {
        return typeof this.body === 'string'
          ? this.body
          : JSON.stringify(this.body);
      },
      get bodyJson(): JSONObject {
        if (typeof this.body === 'string') {
          try {
            return JSON.parse(this.body);
          } catch {
            return {};
          }
        }
        return this.body;
      },
      get bodyBinary(): Buffer {
        return Buffer.from(this.bodyRaw);
      },
    } satisfies AppwriteRequest;
    if (!isAppwriteRequest(appwriteReq)) {
      throw new Error('Mock appwriteReq does not satisfy AppwriteRequest');
    }
    // Check AppwriteRequest properties
    expect(appwriteReq.url).toBe('https://example.com/widgets/42?foo=bar');
    expect(appwriteReq.method).toBe('POST');
    expect(appwriteReq.headers.Authorization).toBe('Bearer token');
    expect(appwriteReq.headers['Content-Type']).toBe('application/json');
    expect(appwriteReq.path).toBe('/widgets/42');
    expect(appwriteReq.body).toEqual({ foo: 'bar' });
    expect(appwriteReq.bodyJson).toEqual({ foo: 'bar' });
    expect(appwriteReq.host).toBe('example.com');
    expect(appwriteReq.scheme).toBe('https');
    expect(appwriteReq.query).toEqual({ foo: 'bar' });
    expect(appwriteReq.queryString).toBe('foo=bar');
    expect(appwriteReq.port).toBe('443');
    // Check that no AppwriteRequest property (getter/setter) is broken
    expect(() => appwriteReq.bodyJson).not.toThrow();
    // Check that the object works in a simulated handler
    function fakeHandler(r: AppwriteRequest) {
      return {
        method: r.method,
        path: r.path,
        body: r.body,
        auth: r.headers.Authorization,
      };
    }
    const result = fakeHandler(appwriteReq);
    expect(result).toEqual({
      method: 'POST',
      path: '/widgets/42',
      body: { foo: 'bar' },
      auth: 'Bearer token',
    });
  });
});
