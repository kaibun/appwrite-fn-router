import "@typespec/http";
import "@typespec/openapi";
import "@typespec/openapi3";
import "@typespec/versioning";

using Http;
using OpenAPI;
using Versioning;
/**
 * Welcome to this fake-yet-live API for testing Appwrite Function Router!
 *
 * This API is designed to demonstrate and test the capabilities of the library.
 * It includes various operations for managing so-called "widgets", including creating, reading, updating, and deleting them in a RESTful manner.
 * It also includes non-standard operations, such as "analyzing widgets", and "accessing a secret widget" which requires authentication with a Bearer token.
 *
 * **The API is of course [implemented as an Appwrite Function](https://github.com/kaibun/appwrite-fn-router/tree/main/functions/Test) which uses the Appwrite Function Router library**. Upon triggering a query, it is expected the function will successfully execute the matching endpoints and return the expected response.
 * */
@service(#{ title: "The Widget API" })
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
   * List widgets
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
   * Read widgets
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
   * Create a widget
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
   * Update a widget
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
   * Delete a widget
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
   * Analyze a widget
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
   * */
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
