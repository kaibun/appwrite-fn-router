import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";
import "@typespec/versioning";

using Http;
using OpenAPI;
using Versioning;
/**
 * Welcome to the Widgets API for testing Appwrite Function Router!

 * **This is a live API that is [implemented as an Appwrite Function](https://github.com/kaibun/appwrite-fn-router/tree/main/functions/Test) that uses the very Appwrite Function Router library**.

 * This API is designed to demonstrate and test the capabilities of the library.
 * It showcases how to use AFR and its router to manage a fake resource "widgets": creating, reading, updating, and deleting them in a RESTful manner, as well as some non-standard operations, such as "analyzing widgets", and "accessing a secret widget" (which requires authentication with a Bearer token).
 *
 * Here’s what the actual code looks like (non-exhaustive):
 *
 * ```typescript
 * import { inspect } from 'node:util';
 * import type { AppwriteContext, CatchHandler } from '@kaibun/appwrite-fn-router';
 * import { handleRequest } from '@kaibun/appwrite-fn-router';
 * // The /widgets routes are defined in a separate file,
 * // and you’ll get to see each exported route handler in
 * // the examples associated to the different routes below.
 * import widgetsRouter from './routes/widgets.ts';
 *
 * // The API routes
 * function routes(router: ReturnType<typeof createRouter>) {
 *   router.all('/widgets*', widgetsRouter.fetch);
 *   router.all('*', (req, res) => res.json({ message: "?!" }, 404));
 * }
 * 
 * // Global request routing/processing error catcher
 * const catchHandler: CatchHandler = (err, req, res, log, error) => {
 *   error(err ? inspect(err) : 'Unknown error');
 *   errorService.send(err, req);
 *   throw err; // re-throwing triggers library’s default error handling
 * };
 *
 * // Appwrite Function entrypoint
 * export default async function main(context: AppwriteContext) {
 *   return await handleRequest(context, routes, {
 *     ittyOptions: {
 *       catch: catchHandler,
 *     },
 *   });
 * }
 * ```
 * 
 * <scalar-button title="test" href="http://google.com"></scalar-button>
 * 
 * <scalar-callout type="info" title="Note importante">
 * Ce point est crucial pour l’utilisation de l’API.
 * </scalar-callout>
 * */
@service(#{ title: "The Widgets API" })
@info(#{
  `x-termsOfService`: "https://appwrite-fn-router.appwrite.io/terms",
  `x-version`: "1.0.0",
  `x-description`: "A service for managing widgets.",
  `x-license`: #{ name: "MIT", url: "https://opensource.org/license/mit/" },
  `x-contact`: #{ name: "Maintainer", email: "support+afr@kaibun.net" },
})
@versioned(Versions)
@server("http://localhost:3000", "Local development server")
namespace DemoService;

enum Versions {
  v010: "0.1.0",
}

/**
 * A widget model for testing purposes
 * @property id The unique identifier for the widget
 * @property weight The weight of the widget in grams (0 to 20,000)
 * @property color The color of the widget
 */
model Widget {
  @visibility(Lifecycle.Read, Lifecycle.Update)
  id: string;

  @minValue(0)
  @maxValue(20000)
  @visibility(Lifecycle.Read, Lifecycle.Create, Lifecycle.Update)
  weight: int32;

  @visibility(Lifecycle.Read, Lifecycle.Create, Lifecycle.Update)
  color: "red" | "blue" | "gold";
}

const WidgetExample1 = #{ id: "widget1", weight: 10, color: "red" };
const WidgetExample2 = #{ id: "widget2", weight: 20, color: "blue" };
const WidgetExampleSecret = #{
  id: "widget-secret",
  weight: 200,
  color: "gold",
};

/**
 * A widget list model for testing purposes
 * @property items The list of widgets
 */
model WidgetList {
  items: Widget[];
}

/**
 * The result of a widget analysis.
 * @property statusCode The status code of the response.
 * @property id The ID of the analyzed widget.
 * @property analysis The analysis result.
 */
model AnalyzeResult {
  statusCode: int32;
  id: string;
  analysis: string;
}

/**
 * Common parameters for all operations.
 * @property locale The locale for the request.
 * @property clientVersion The client version of the application.
 */
model CommonParameters {
  // @header
  // requestID: string;

  @query
  locale?: string;

  @header
  clientVersion?: string;
}

model WidgetListResponse {
  ...OkResponse;
  ...Body<WidgetList>;
}

model WidgetResponse {
  ...OkResponse;
  ...Body<Widget>;
}

model WidgetCreatedResponse {
  ...CreatedResponse;
  ...Body<Widget>;
}

model WidgetAcceptedResponse {
  ...AcceptedResponse;
  ...Body<Widget>;
}

model WidgetErrorResponse {
  ...BadRequestResponse;
  ...Body<ValidationError>;
}

model WidgetNotFoundResponse {
  ...NotFoundResponse;
  ...Body<NotFoundError>;
}

model WidgetUnauthorizedResponse {
  ...UnauthorizedResponse;
  ...Body<UnauthorizedError>;
}

model WidgetSuccessResponse {
  ...OkResponse;
  ...Body<string>;
}

model WidgetNoContentResponse {
  ...NoContentResponse;
}

/**
 * Generic error response
 * @property code Error code
 * @property message Error message
 */
@example(#{ code: 404, message: "Widget not found" })
@example(#{ code: 500, message: "Internal server error" })
@error
model ErrorResponse {
  code: int32;
  message: string;
}

/**
 * Validation error
 * @property code Validation error code
 * @property message Validation error message
 * @property errors List of validation errors
 */
@error
model ValidationError {
  code: "VALIDATION_ERROR";
  message: string;
  errors: string[];
}

/**
 * Not found error
 * @property code Not found error code
 * @property message Not found error message
 */
@error
model NotFoundError {
  code: "NOT_FOUND";
  message: string;
}

/**
 * Unauthorized error
 * @property code The error code.
 * @property message The error message.
 */
model UnauthorizedError {
  code: "UNAUTHORIZED";
  message: "Unauthorized";
}

/** Unauthorized error response */
@error
model UnauthorizedErrorResponse {
  ...UnauthorizedResponse;
  ...Body<UnauthorizedError>;
}

@error
model InternalServerErrorResponse {
  @statusCode statusCode: 500;
  ...Body<{
    code: "INTERNAL_SERVER_ERROR";
    message: "Internal server error";
  }>;
}

/** Operations for managing widgets */
@route("/widgets")
@tag("Widgets")
interface Widgets {
  /**
   * Retrieve the list of widgets.
   *
   * ```typescript
   * // GET /widgets => List widgets
   * router.get('/', (_req, res, _log, _error) => {
   *   const response = res.json({
   *     items: [
   *       { id: 'widget1', weight: 10, color: 'red' },
   *       { id: 'widget2', weight: 20, color: 'blue' },
   *     ],
   *   });
   *   return response;
   * });
   * ```
   *
   * @param locale The locale for the request.
   * @param clientVersion The client version for the request.
   */
  @opExample(#{
    returnType: #{
      statusCode: 200,
      body: #{ items: #[WidgetExample1, WidgetExample2] },
    },
  })
  @get
  listWidgets(
    ...CommonParameters,
  ): WidgetListResponse | InternalServerErrorResponse | ErrorResponse;

  /**
   * Retrieve a specific widget.
   *
   * ```typescript
   * // GET /widgets/{id} => Retrieve a specific widget
   * router.get('/:id', (req, res, _log, _error) => {
   *   const { id } = req.params;
   *   if (id === 'not-found') {
   *     return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
   *   }
   *   return res.json({ id, weight: 10, color: 'red' });
   * });
   * ```
   *
   * @param id The ID of the widget to retrieve.
   */
  @opExample(#{
    parameters: #{ id: "widget1" },
    returnType: #{ statusCode: 200, body: WidgetExample1 },
  })
  @get
  getWidget(@path id: string):
    | WidgetResponse
    | WidgetNotFoundResponse
    | InternalServerErrorResponse
    | ErrorResponse;

  /**
   * Create a widget.
   *
   * ```typescript
   * // POST /widgets => Create a widget
   * router.post('/', async (req, res, _log, _error) => {
   *   try {
   *     const body = req.bodyJson as Partial<Widget>;
   *     if (typeof body.weight !== 'number' || !body.color) {
   *       return res.json(
   *         {
   *           code: 'VALIDATION_ERROR',
   *           message: 'Missing required fields',
   *           errors: ['weight and color are required'],
   *         },
   *         400
   *       );
   *     }
   *     const newWidget: Widget = {
   *       id: `widget-${Date.now()}`,
   *       weight: body.weight,
   *       color: body.color,
   *     };
   *     return res.json(newWidget, 201);
   *   } catch (e) {
   *     if (e instanceof SyntaxError) {
   *       return res.json(
   *         {
   *           code: 'BAD_REQUEST',
   *           message: 'Invalid JSON in request body',
   *         },
   *         400
   *       );
   *     }
   *     _error(String(e));
   *     // Let the error be handled by the framework
   *     throw e;
   *   }
   * });
   * ```
   *
   * @param body The widget to create.
   */
  @opExample(#{
    parameters: #{ body: WidgetExample1 },
    returnType: #{ statusCode: 201, body: WidgetExample1 },
  })
  @post
  createWidget(@body body: Widget):
    | WidgetCreatedResponse
    | WidgetAcceptedResponse
    | WidgetErrorResponse
    | WidgetUnauthorizedResponse
    | InternalServerErrorResponse
    | ErrorResponse;

  /**
   * Update a widget.
   *
   * ```typescript
   * // PATCH /widgets/{id} => Update a widget
   * router.patch('/:id', async (req, res, _log, _error) => {
   *   try {
   *     const { id } = req.params;
   *     if (id === 'not-found') {
   *       return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
   *     }
   *     const body = req.bodyJson as Partial<Widget>;
   *     const updatedWidget: Widget = {
   *       id,
   *       weight: body.weight ?? 10,
   *       color: body.color ?? 'red',
   *     };
   *     return res.json(updatedWidget);
   *   } catch (e) {
   *     if (e instanceof SyntaxError) {
   *       return res.json(
   *         {
   *           code: 'BAD_REQUEST',
   *           message: 'Invalid JSON in request body',
   *         },
   *         400
   *       );
   *     }
   *     _error(String(e));
   *     // Let the error be handled by the framework
   *     throw e;
   *   }
   * });
   * ```
   *
   * @param id The ID of the widget to update.
   * @param body The widget data to update.
   */
  @opExample(#{
    parameters: #{ id: "widget1", body: #{ weight: 15, color: "blue" } },
    returnType: #{
      statusCode: 200,
      body: #{ id: "widget1", weight: 15, color: "blue" },
    },
  })
  @patch
  updateWidget(@path id: string, @body body: MergePatchUpdate<Widget>):
    | WidgetResponse
    | WidgetErrorResponse
    | WidgetUnauthorizedResponse
    | WidgetNotFoundResponse
    | InternalServerErrorResponse
    | ErrorResponse;

  /**
   * Delete a widget.
   *
   * ```typescript
   * // DELETE /widgets/{id} => Delete a widget
   * router.delete('/:id', (req, res, _log, _error) => {
   *   const { id } = req.params;
   *   if (id === 'not-found') {
   *     return res.json({ code: 'NOT_FOUND', message: 'Widget not found' }, 404);
   *   }
   *   return res.send('', 204);
   * });
   * ```
   *
   * @param id The ID of the widget to delete.
   */
  @opExample(#{ parameters: #{ id: "widget1" } })
  @delete
  deleteWidget(@path id: string):
    | WidgetNoContentResponse
    | WidgetNotFoundResponse
    | WidgetUnauthorizedResponse
    | InternalServerErrorResponse
    | ErrorResponse;

  /**
   * Analyze a widget.
   *
   * ```typescript
   * // POST /widgets/{id} => Analyze a widget
   * router.post('/:id', (req, res, _log, _error) => {
   *   const { id } = req.params;
   *   return res.json({
   *     statusCode: 200,
   *     id,
   *     analysis: 'This widget is amazing!',
   *   });
   * });
   * ```
   *
   * @param id The ID of the widget to analyze.
   */
  @opExample(#{
    parameters: #{ id: "widget1" },
    returnType: #{
      statusCode: 200,
      id: "widget1",
      analysis: "This widget is well-balanced",
    },
  })
  @post
  analyze(
    @path id: string,
  ): AnalyzeResult | InternalServerErrorResponse | ErrorResponse;

  /**
   * Accessing the daily secret widget is a premium feature!
   *
   * Pass in an Authorization header with a "Bearer token" value.
   *
   * ```typescript
   * // GET /widgets/secret => Accessing the daily secret widget (requires Bearer token)
   * router.get('/secret', (req, res, _log, _error) => {
   *   const authHeader =
   *     req.headers['Authorization'] || req.headers['authorization'];
   *   if (!authHeader || !authHeader.startsWith('Bearer ')) {
   *     return res.json({ code: 'UNAUTHORIZED', message: 'Unauthorized' }, 401);
   *   }
   *   return res.json({ id: 'widget-secret', weight: 200, color: 'gold' });
   * });
   * ```
   */
  @route("/secret")
  @tag("Secret Widget")
  @useAuth(BearerAuth)
  @opExample(#{ returnType: #{ statusCode: 200, body: WidgetExampleSecret } })
  @get
  secretOperation():
    | WidgetResponse
    | UnauthorizedErrorResponse
    | InternalServerErrorResponse
    | ErrorResponse;
}
