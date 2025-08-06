import type {
  Request,
  Response,
  DefaultLogger,
  ErrorLogger,
  ResponseObject,
} from './lib/env.d.ts';
import type { MyJSONResponse } from './main.ts';

export const myRouteHandler = (
  req: Request,
  res: Response,
  _log: DefaultLogger,
  _error: ErrorLogger
) => {
  return res.json({
    status: 'success',
    message: 'Mystery route!',
  }) satisfies ResponseObject<MyJSONResponse>;
};
