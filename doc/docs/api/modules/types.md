---
id: "types"
title: "Module: types"
sidebar_label: "types"
sidebar_position: 0
custom_edit_url: null
---

## Type Aliases

### BufferFromArgTypes

Ƭ **BufferFromArgTypes**: `Parameters`\<typeof `Buffer.from`\>[``0``]

#### Defined in

[types/core.d.ts:41](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L41)

___

### Context

Ƭ **Context**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | [`ErrorLogger`](types.md#errorlogger) |
| `log` | [`DefaultLogger`](types.md#defaultlogger) |
| `req` | [`Request`](types.md#request) |
| `res` | [`Response`](types.md#response) |

#### Defined in

[types/core.d.ts:71](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L71)

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

[types/core.d.ts:5](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L5)

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

[types/core.d.ts:6](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L6)

___

### Headers

Ƭ **Headers**: `Record`\<`string`, `string`\>

#### Defined in

[types/core.d.ts:8](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L8)

___

### JSONObject

Ƭ **JSONObject**: `Record`\<`string`, `unknown`\>

#### Defined in

[types/core.d.ts:9](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L9)

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
| `errorLog?` | `boolean` |
| `globals?` | `boolean` |
| `log?` | `boolean` |
| `onError?` | (`err`: `unknown`) => `void` |

#### Defined in

[types/core.d.ts:79](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L79)

___

### Request

Ƭ **Request**: `Object`

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

[types/core.d.ts:24](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L24)

___

### Response

Ƭ **Response**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `binary` | (`data`: [`BufferFromArgTypes`](types.md#bufferfromargtypes), `statusCode?`: `number`, `headers?`: [`Headers`](types.md#headers)) => [`ResponseObject`](types.md#responseobject)\<`string`\> |
| `empty` | () => [`ResponseObject`](types.md#responseobject) |
| `redirect` | (`url`: `string`, `statusCode?`: `number`, `headers?`: [`Headers`](types.md#headers)) => [`ResponseObject`](types.md#responseobject)\<`string`\> |
| `send` | (`body`: `string`, `statusCode?`: `number`, `headers?`: [`Headers`](types.md#headers)) => [`ResponseObject`](types.md#responseobject)\<`string`\> |
| `text` | (`body`: `string`, `statusCode?`: `number`, `headers?`: [`Headers`](types.md#headers)) => [`ResponseObject`](types.md#responseobject)\<`string`\> |
| `json` | \<DataType\>(`data`: `DataType`, `statusCode?`: `number`, `headers?`: [`Headers`](types.md#headers)) => [`ResponseObject`](types.md#responseobject)\<`DataType`\> |

#### Defined in

[types/core.d.ts:42](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L42)

___

### ResponseObject

Ƭ **ResponseObject**\<`T`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body` | `T` |
| `headers` | [`Headers`](types.md#headers) |
| `statusCode` | `number` |
| `toString` | () => `string` |

#### Defined in

[types/core.d.ts:11](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L11)

___

### RouterJSONResponse

Ƭ **RouterJSONResponse**: \{ `error?`: `string` ; `message`: `string` ; `status`: ``"success"`` \| ``"error"``  } & [`JSONObject`](types.md#jsonobject)

#### Defined in

[types/core.d.ts:92](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L92)

___

### RunArgs

Ƭ **RunArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | \{ `domainSlice`: `string`  } |
| `data.domainSlice` | `string` |

#### Defined in

[types/core.d.ts:18](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L18)

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

[types/widget.d.ts:3](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/widget.d.ts#L3)

___

### WrapperRequestType

Ƭ **WrapperRequestType**: `IRequest`

#### Defined in

[types/core.d.ts:100](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/core.d.ts#L100)

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

[types/widget.d.ts:10](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/widget.d.ts#L10)

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

[types/widget.d.ts:20](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/types/widget.d.ts#L20)
