---
id: "types"
title: "Module: types"
sidebar_label: "types"
sidebar_position: 0
custom_edit_url: null
---

## Type Aliases

### AFRContext

Ƭ **AFRContext**: [`AppwriteContext`](types.md#appwritecontext) & \{ `internals`: [`InternalObjects`](types.md#internalobjects) ; `req`: [`AFRRequest`](types.md#afrrequest)  }

#### Defined in

[types/core.d.ts:15](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L15)

___

### AFRContextArgs

Ƭ **AFRContextArgs**: [[`AFRContext`](types.md#afrcontext)[``"req"``], [`AFRContext`](types.md#afrcontext)[``"res"``], [`AFRContext`](types.md#afrcontext)[``"log"``], [`AFRContext`](types.md#afrcontext)[``"error"``], [`AFRContext`](types.md#afrcontext)[``"internals"``], ...any[]]

Type describing an Appwrite Function Router’s context.

It extends the standard Appwrite `Context` with the following tweaks:

- `req` is a `AFRRequest` (which includes all AppwriteRequest properties and getters)
- `internals` is an optional object that can hold additional internal state or objects.

You may still pass any additional arguments to the context. They they will be ignored by the library, but will show up in your route handlers and
middlewares for you to use.

Don’t forget you may also use the request object (first argument) as a mean
to pass additional data to your callbacks, which may be more semantic.

#### Defined in

[types/core.d.ts:34](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L34)

___

### AFRRequest

Ƭ **AFRRequest**: `IRequest` & [`AppwriteRequest`](types.md#appwriterequest)

itty-router injects properties at runtime, such as params, query and route. TypeScript has to know about that to avoid type errors in route handlers. Also, it allows the end-user to inject her own properties. Basically, it’s AppwriteRequest on steroids and fit for itty-router consumption.

**`See`**

https://github.com/kwhitley/itty-router/blob/v5.x/src/Router.ts

#### Defined in

[types/core.d.ts:136](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L136)

___

### AppwriteContext

Ƭ **AppwriteContext**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | [`ErrorLogger`](types.md#errorlogger) |
| `log` | [`DefaultLogger`](types.md#defaultlogger) |
| `req` | [`AppwriteRequest`](types.md#appwriterequest) |
| `res` | [`AppwriteResponse`](types.md#appwriteresponse) |

#### Defined in

[types/core.d.ts:119](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L119)

___

### AppwriteRequest

Ƭ **AppwriteRequest**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `headers` | [`Headers`](types.md#headers) |
| `host` | `string` |
| `method` | ``"GET"`` \| ``"POST"`` \| ``"PUT"`` \| ``"DELETE"`` \| ``"PATCH"`` \| ``"OPTIONS"`` |
| `path` | `string` |
| `port` | `string` |
| `query` | [`JSONObject`](types.md#jsonobject) |
| `queryString` | `string` |
| `scheme` | ``"http"`` \| ``"https"`` |
| `url` | `string` |
| `get body()` | `string` \| [`JSONObject`](types.md#jsonobject) |
| `get bodyBinary()` | `Buffer` |
| `get bodyJson()` | [`JSONObject`](types.md#jsonobject) |
| `get bodyRaw()` | `string` |
| `get bodyText()` | `string` |

#### Defined in

[types/core.d.ts:72](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L72)

___

### AppwriteResponse

Ƭ **AppwriteResponse**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `binary` | (`data`: [`BufferFromArgTypes`](types.md#bufferfromargtypes), `statusCode?`: `number`, `headers?`: [`Headers`](types.md#headers)) => `ResponseObject`\<`string`\> |
| `empty` | () => `ResponseObject` |
| `redirect` | (`url`: `string`, `statusCode?`: `number`, `headers?`: [`Headers`](types.md#headers)) => `ResponseObject`\<`string`\> |
| `send` | (`body`: `string`, `statusCode?`: `number`, `headers?`: [`Headers`](types.md#headers)) => `ResponseObject`\<`string`\> |
| `text` | (`body`: `string`, `statusCode?`: `number`, `headers?`: [`Headers`](types.md#headers)) => `ResponseObject`\<`string`\> |
| `json` | \<DataType\>(`data`: `DataType`, `statusCode?`: `number`, `headers?`: [`Headers`](types.md#headers)) => `ResponseObject`\<`DataType`\> |

#### Defined in

[types/core.d.ts:90](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L90)

___

### AppwriteResponseObject

Ƭ **AppwriteResponseObject**\<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body` | `T` |
| `headers?` | [`Headers`](types.md#headers) |
| `statusCode` | `number` |
| `toString` | () => `string` |

#### Defined in

[types/core.d.ts:48](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L48)

___

### BufferFromArgTypes

Ƭ **BufferFromArgTypes**: `Parameters`\<typeof `Buffer.from`\>[``0``]

#### Defined in

[types/core.d.ts:89](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L89)

___

### CatchHandler

Ƭ **CatchHandler**: (...`args`: [`Error`, ...AFRContextArgs]) => `any`

#### Type declaration

▸ (`...args`): `any`

##### Parameters

| Name | Type |
| :------ | :------ |
| `...args` | [`Error`, ...AFRContextArgs] |

##### Returns

`any`

#### Defined in

[types/core.d.ts:43](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L43)

___

### DefaultLogger

Ƭ **DefaultLogger**: (`message`: `string`) => `void`

#### Type declaration

▸ (`message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

##### Returns

`void`

#### Defined in

[types/core.d.ts:7](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L7)

___

### ErrorLogger

Ƭ **ErrorLogger**: (`message`: `string`) => `void`

#### Type declaration

▸ (`message`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `string` |

##### Returns

`void`

#### Defined in

[types/core.d.ts:8](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L8)

___

### FinalOptions

Ƭ **FinalOptions**: [`Options`](types.md#options) & \{ `errorLog`: `boolean` ; `log`: `boolean`  }

#### Defined in

[types/core.d.ts:70](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L70)

___

### Headers

Ƭ **Headers**: `Record`\<`string`, `string`\>

#### Defined in

[types/core.d.ts:45](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L45)

___

### InternalObjects

Ƭ **InternalObjects**: `Object`

#### Index signature

▪ [key: `any`]: `unknown`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `request` | `FetchRequest` |

#### Defined in

[types/core.d.ts:10](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L10)

___

### JSONObject

Ƭ **JSONObject**: `Record`\<`string`, `unknown`\>

#### Defined in

[types/core.d.ts:46](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L46)

___

### Options

Ƭ **Options**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `cors?` | \{ `allowHeaders?`: `string`[] ; `allowMethods?`: `string`[] ; `allowedOrigins?`: (`string` \| `RegExp`)[]  } |
| `cors.allowHeaders?` | `string`[] |
| `cors.allowMethods?` | `string`[] |
| `cors.allowedOrigins?` | (`string` \| `RegExp`)[] |
| `env?` | `boolean` |
| `globals?` | `boolean` |
| `ittyOptions?` | `RouterOptions`\<[`AFRRequest`](types.md#afrrequest), [[`AppwriteResponse`](types.md#appwriteresponse), [`DefaultLogger`](types.md#defaultlogger), [`ErrorLogger`](types.md#errorlogger), [`InternalObjects`](types.md#internalobjects)] & `any`[]\> |
| `logs?` | [`logEnableFn`](types.md#logenablefn) \| `boolean` |

#### Defined in

[types/core.d.ts:55](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L55)

___

### RouterJSONResponse

Ƭ **RouterJSONResponse**: \{ `error?`: `string` ; `message`: `string` ; `status`: ``"success"`` \| ``"error"``  } & [`JSONObject`](types.md#jsonobject)

#### Defined in

[types/core.d.ts:126](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L126)

___

### Widget

Ƭ **Widget**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `color` | ``"red"`` \| ``"blue"`` \| ``"gold"`` |
| `id` | `string` |
| `weight` | `number` |

#### Defined in

[types/widget.d.ts:3](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/widget.d.ts#L3)

___

### logEnableFn

Ƭ **logEnableFn**: (`mode`: ``"log"`` \| ``"errorLog"``) => `boolean`

#### Type declaration

▸ (`mode`): `boolean`

##### Parameters

| Name | Type |
| :------ | :------ |
| `mode` | ``"log"`` \| ``"errorLog"`` |

##### Returns

`boolean`

#### Defined in

[types/core.d.ts:138](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/core.d.ts#L138)

## Functions

### isValidWidget

▸ **isValidWidget**(`obj`): obj is Widget

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |

#### Returns

obj is Widget

#### Defined in

[types/widget.d.ts:10](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/widget.d.ts#L10)

___

### isValidWidgetArray

▸ **isValidWidgetArray**(`obj`): obj is Widget[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `obj` | `any` |

#### Returns

obj is Widget[]

#### Defined in

[types/widget.d.ts:20](https://github.com/kaibun/appwrite-fn-router/blob/991d126/types/widget.d.ts#L20)
