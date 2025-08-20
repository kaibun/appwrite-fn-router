---
id: "src_main"
title: "Module: src/main"
sidebar_label: "src/main"
sidebar_position: 0
custom_edit_url: null
---

## Functions

### buildCorsOptions

▸ **buildCorsOptions**(`finalOptions`): `Object`

Enables dynamic CORS configuration.

#### Parameters

| Name | Type |
| :------ | :------ |
| `finalOptions` | [`Options`](types.md#options) |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `allowHeaders` | `string`[] |
| `allowMethods` | `string`[] |
| `origin` | (`origin`: `string`) => `undefined` \| `string` |

#### Defined in

[src/main.ts:212](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/src/main.ts#L212)

___

### buildFinalOptions

▸ **buildFinalOptions**(`options`): [`FinalOptions`](types.md#finaloptions)

Builds the final options from user options and environment.

#### Parameters

| Name | Type |
| :------ | :------ |
| `options` | [`Options`](types.md#options) |

#### Returns

[`FinalOptions`](types.md#finaloptions)

#### Defined in

[src/main.ts:165](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/src/main.ts#L165)

___

### corsFinallyMiddleware

▸ **corsFinallyMiddleware**(`responseFromRoute`, `request`, `res`, `log`, `error`, `internals`): `Promise`\<`any`\>

CORS finalization middleware that’s Appwrite-compatible (to be used last in finally[]).

#### Parameters

| Name | Type |
| :------ | :------ |
| `responseFromRoute` | `any` |
| `request` | [`AppwriteRequest`](types.md#appwriterequest) |
| `res` | [`AppwriteResponse`](types.md#appwriteresponse) |
| `log` | [`DefaultLogger`](types.md#defaultlogger) |
| `error` | [`ErrorLogger`](types.md#errorlogger) |
| `internals` | [`InternalObjects`](types.md#internalobjects) & \{ `corsify`: (`res`: `Response`, `req`: `Request`) => `Response`  } |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/main.ts:70](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/src/main.ts#L70)

___

### corsPreflightMiddleware

▸ **corsPreflightMiddleware**(`req`, `res`, `log`, `error`, `internals`): `Promise`\<`any`\>

CORS preflight middleware that’s Appwrite-compatible (to be used first in before[]).

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AppwriteRequest`](types.md#appwriterequest) |
| `res` | [`AppwriteResponse`](types.md#appwriteresponse) |
| `log` | [`DefaultLogger`](types.md#defaultlogger) |
| `error` | [`ErrorLogger`](types.md#errorlogger) |
| `internals` | [`InternalObjects`](types.md#internalobjects) & \{ `preflight`: (`req`: `Request`) => `undefined` \| `Response`  } |

#### Returns

`Promise`\<`any`\>

#### Defined in

[src/main.ts:48](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/src/main.ts#L48)

___

### createRouter

▸ **createRouter**(`«destructured»?`): `RouterType`\<[`AFRRequest`](types.md#afrrequest), [[`AppwriteResponse`](types.md#appwriteresponse), [`DefaultLogger`](types.md#defaultlogger), [`ErrorLogger`](types.md#errorlogger), [`InternalObjects`](types.md#internalobjects)] & `any`[], [`AppwriteResponse`](types.md#appwriteresponse)\>

The router propagates a standard Appwrite signature to handlers:
`req, res, log, error` typed as `AppwriteRequest`, `AppwriteResponse`,
`DefaultLogger`, `ErrorLogger` respectively.

Internal Itty Router middlewares (e.g. preflight/corsify) can access the
native Request object (Fetch API) via a fifth argument corresponding to
`InternalObjects`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `RouterOptions`\<[`AFRRequest`](types.md#afrrequest), [[`AppwriteResponse`](types.md#appwriteresponse), [`DefaultLogger`](types.md#defaultlogger), [`ErrorLogger`](types.md#errorlogger), [`InternalObjects`](types.md#internalobjects)] & `any`[]\> |

#### Returns

`RouterType`\<[`AFRRequest`](types.md#afrrequest), [[`AppwriteResponse`](types.md#appwriteresponse), [`DefaultLogger`](types.md#defaultlogger), [`ErrorLogger`](types.md#errorlogger), [`InternalObjects`](types.md#internalobjects)] & `any`[], [`AppwriteResponse`](types.md#appwriteresponse)\>

#### Defined in

[src/main.ts:108](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/src/main.ts#L108)

___

### defaultLogFn

▸ **defaultLogFn**(`mode`): `boolean`

Default log activation callback: logs are enabled only in development.
Users can override this by passing their own function to handleRequest.

#### Parameters

| Name | Type |
| :------ | :------ |
| `mode` | ``"log"`` \| ``"errorLog"`` |

#### Returns

`boolean`

#### Defined in

[types/core.d.ts:138](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/types/core.d.ts#L138)

___

### handleRequest

▸ **handleRequest**(`context`, `withRouter`, `options?`): `Promise`\<`any`\>

Main entry point for handling an Appwrite function HTTP request using the router abstraction.

This function orchestrates the full lifecycle of a request:

- Normalizes headers for case-insensitive access.
- Builds the final options from user options and environment.
- Initializes log and error functions, and propagates them globally if requested.
- Updates required environment variables (e.g., Appwrite API key) if requested.
- Dynamically configures CORS according to environment and options.
- Composes middlewares (before/finally) for the router, including CORS and user-provided ones.
- Instantiates the router, then delegates to the user-provided `withRouter` callback to define routes.
- Executes the router on the request, handles the response and logging.
- Handles uncaught errors via handleRequestError.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `context` | [`AppwriteContext`](types.md#appwritecontext) | Appwrite context (req, res, log, error) |
| `withRouter` | (`router`: `RouterType`\<[`AFRRequest`](types.md#afrrequest), [[`AppwriteResponse`](types.md#appwriteresponse), [`DefaultLogger`](types.md#defaultlogger), [`ErrorLogger`](types.md#errorlogger), [`InternalObjects`](types.md#internalobjects)] & `any`[], [`AppwriteResponse`](types.md#appwriteresponse)\>) => `void` | User function to define routes on the router |
| `options` | [`Options`](types.md#options) | Advanced options (CORS, logs, middlewares, etc.) |

#### Returns

`Promise`\<`any`\>

AppwriteResponseObject generated by the router, or a formatted error

#### Defined in

[src/main.ts:334](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/src/main.ts#L334)

___

### handleRequestError

▸ **handleRequestError**(`err`, `options`, `req`, `res`, `log`, `error`): `any`

Centralized error handling for uncatched exceptions stemming from the router.
This function may be circumvented by a custom `catch handler in `ittyOptions`.

#### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `unknown` |
| `options` | [`FinalOptions`](types.md#finaloptions) |
| `req` | [`AppwriteRequest`](types.md#appwriterequest) |
| `res` | [`AppwriteResponse`](types.md#appwriteresponse) |
| `log` | [`DefaultLogger`](types.md#defaultlogger) |
| `error` | [`ErrorLogger`](types.md#errorlogger) |

#### Returns

`any`

#### Defined in

[src/main.ts:280](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/src/main.ts#L280)

___

### normalizeHeaders

▸ **normalizeHeaders**(`req`): `void`

Normalizes Appwrite request headers as case-insensitive keys, so that you can
use either eg. `Authorization` or `authorization` keys in your handlers.

#### Parameters

| Name | Type |
| :------ | :------ |
| `req` | [`AppwriteRequest`](types.md#appwriterequest) |

#### Returns

`void`

#### Defined in

[src/main.ts:128](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/src/main.ts#L128)

___

### runRouter

▸ **runRouter**(`router`, `«destructured»`): `Promise`\<[`AppwriteResponse`](types.md#appwriteresponse)\>

Runs the router with the Appwrite context, as well as a native `Request` for proper CORS, etc. in the Itty router.

#### Parameters

| Name | Type |
| :------ | :------ |
| `router` | `RouterType`\<[`AFRRequest`](types.md#afrrequest), [[`AppwriteResponse`](types.md#appwriteresponse), [`DefaultLogger`](types.md#defaultlogger), [`ErrorLogger`](types.md#errorlogger), [`InternalObjects`](types.md#internalobjects)] & `any`[], [`AppwriteResponse`](types.md#appwriteresponse)\> |
| `«destructured»` | [`AppwriteContext`](types.md#appwritecontext) |

#### Returns

`Promise`\<[`AppwriteResponse`](types.md#appwriteresponse)\>

#### Defined in

[src/main.ts:252](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/src/main.ts#L252)

___

### setupEnvVars

▸ **setupEnvVars**(`finalOptions`, `req`): `void`

Updates the `APPWRITE_FUNCTION_API_KEY` environment variable, if requested.

#### Parameters

| Name | Type |
| :------ | :------ |
| `finalOptions` | [`Options`](types.md#options) |
| `req` | [`AppwriteRequest`](types.md#appwriterequest) |

#### Returns

`void`

#### Defined in

[src/main.ts:202](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/src/main.ts#L202)

___

### setupGlobalLoggers

▸ **setupGlobalLoggers**(`finalOptions`, `log`, `error`): `void`

Propagates Appwrite logging functions to the global context, if requested.

#### Parameters

| Name | Type |
| :------ | :------ |
| `finalOptions` | [`Options`](types.md#options) |
| `log` | [`DefaultLogger`](types.md#defaultlogger) |
| `error` | [`ErrorLogger`](types.md#errorlogger) |

#### Returns

`void`

#### Defined in

[src/main.ts:187](https://github.com/kaibun/appwrite-fn-router/blob/c538ad2/src/main.ts#L187)
