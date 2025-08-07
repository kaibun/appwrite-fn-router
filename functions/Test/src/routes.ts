import type {
  Request,
  Response,
  DefaultLogger,
  ErrorLogger,
  ResponseObject,
  RouterJSONResponse,
} from '../../../types';

export const myRouteHandler = (
  req: Request,
  res: Response,
  _log: DefaultLogger,
  _error: ErrorLogger
) => {
  return res.json({
    status: 'success',
    message: 'Mystery route!',
  }) satisfies ResponseObject<RouterJSONResponse>;
};
