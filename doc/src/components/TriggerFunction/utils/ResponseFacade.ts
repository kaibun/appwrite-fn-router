/**
 * ResponseFacade: workaround for Fetch API limitations.
 *
 * The native Fetch API only allows reading the body of a Response once.
 * Any subsequent call to .text(), .json(), etc. will throw an error.
 *
 * This wrapper always returns a fresh clone of the original Response
 * via getResponse(), so every consumer (eg. React subcomponent) can safely read
 * the body as if it was a brand new Response.
 *
 * Usage:
 *   - Store the original Response in ResponseFacade.
 *   - Pass responseFacade.getResponse() to any subcomponent needing a Response.
 *   - Always read the body on a clone, never on the original.
 *
 * This avoids all "body stream already read" errors and keeps the API clean.
 */
export default class ResponseFacade {
  private _response: Response;
  constructor(response: Response) {
    this._response = response;
  }
  getResponse(): Response {
    return this._response.clone();
  }
}
