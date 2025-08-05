---
id: "env"
title: "Module: env"
sidebar_label: "env"
sidebar_position: 0
custom_edit_url: null
---

## Type Aliases

### BufferFromArgTypes

Ƭ **BufferFromArgTypes**: `Parameters`\<typeof `Buffer.from`\>[``0``]

#### Defined in

[env.d.ts:35](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/env.d.ts#L35)

___

### Context

Ƭ **Context**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `error` | [`ErrorLogger`](env.md#errorlogger) |
| `log` | [`DefaultLogger`](env.md#defaultlogger) |
| `req` | [`Request`](env.md#request) |
| `res` | [`Response`](env.md#response) |

#### Defined in

[env.d.ts:65](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/env.d.ts#L65)

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

[env.d.ts:1](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/env.d.ts#L1)

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

[env.d.ts:2](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/env.d.ts#L2)

___

### Headers

Ƭ **Headers**: `Record`\<`string`, `string`\>

#### Defined in

[env.d.ts:4](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/env.d.ts#L4)

___

### JSONObject

Ƭ **JSONObject**: `Record`\<`string`, `unknown`\>

#### Defined in

[env.d.ts:5](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/env.d.ts#L5)

___

### Request

Ƭ **Request**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `headers` | [`Headers`](env.md#headers) |
| `host` | `string` |
| `method` | ``"GET"`` \| ``"POST"`` \| ``"PUT"`` \| ``"DELETE"`` \| ``"PATCH"`` \| ``"OPTIONS"`` |
| `path` | `string` |
| `port` | `string` |
| `query` | [`JSONObject`](env.md#jsonobject) |
| `queryString` | `string` |
| `scheme` | ``"http"`` \| ``"https"`` |
| `url` | `string` |
| `get body()` | `string` \| [`JSONObject`](env.md#jsonobject) |
| `get bodyBinary()` | `Buffer` |
| `get bodyJson()` | [`JSONObject`](env.md#jsonobject) |
| `get bodyRaw()` | `string` |
| `get bodyText()` | `string` |

#### Defined in

[env.d.ts:13](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/env.d.ts#L13)

___

### Response

Ƭ **Response**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `binary` | (`data`: [`BufferFromArgTypes`](env.md#bufferfromargtypes), `statusCode?`: `number`, `headers?`: [`Headers`](env.md#headers)) => [`ResponseObject`](env.md#responseobject)\<`string`\> |
| `empty` | () => [`ResponseObject`](env.md#responseobject) |
| `redirect` | (`url`: `string`, `statusCode?`: `number`, `headers?`: [`Headers`](env.md#headers)) => [`ResponseObject`](env.md#responseobject)\<`string`\> |
| `send` | (`body`: `string`, `statusCode?`: `number`, `headers?`: [`Headers`](env.md#headers)) => [`ResponseObject`](env.md#responseobject)\<`string`\> |
| `text` | (`body`: `string`, `statusCode?`: `number`, `headers?`: [`Headers`](env.md#headers)) => [`ResponseObject`](env.md#responseobject)\<`string`\> |
| `json` | \<DataType\>(`data`: `DataType`, `statusCode?`: `number`, `headers?`: [`Headers`](env.md#headers)) => [`ResponseObject`](env.md#responseobject)\<`DataType`\> |

#### Defined in

[env.d.ts:36](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/env.d.ts#L36)

___

### ResponseObject

Ƭ **ResponseObject**\<`BodyType`\>: `Object`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `BodyType` | `unknown` |

#### Type declaration

| Name | Type |
| :------ | :------ |
| `body` | `BodyType` |
| `headers` | [`Headers`](env.md#headers) |
| `statusCode` | `number` |

#### Defined in

[env.d.ts:30](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/env.d.ts#L30)

___

### RunArgs

Ƭ **RunArgs**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data` | \{ `domainSlice`: `string`  } |
| `data.domainSlice` | `string` |

#### Defined in

[env.d.ts:7](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/env.d.ts#L7)
