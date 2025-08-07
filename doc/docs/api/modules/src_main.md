---
id: "src_main"
title: "Module: src/main"
sidebar_label: "src/main"
sidebar_position: 0
custom_edit_url: null
---

## Functions

### createRouter

▸ **createRouter**(`«destructured»?`): `RouterType`\<`IRequest`, [[`Request`](types.md#request), [`Response`](types.md#response), [`DefaultLogger`](types.md#defaultlogger), [`ErrorLogger`](types.md#errorlogger)] & `any`[], [`Response`](types.md#response)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `RouterOptions`\<`IRequest`, [[`Request`](types.md#request), [`Response`](types.md#response), [`DefaultLogger`](types.md#defaultlogger), [`ErrorLogger`](types.md#errorlogger)] & `any`[]\> |

#### Returns

`RouterType`\<`IRequest`, [[`Request`](types.md#request), [`Response`](types.md#response), [`DefaultLogger`](types.md#defaultlogger), [`ErrorLogger`](types.md#errorlogger)] & `any`[], [`Response`](types.md#response)\>

#### Defined in

[src/main.ts:37](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/src/main.ts#L37)

___

### handleRequest

▸ **handleRequest**(`context`, `withRouter`, `options?`): `Promise`\<[`Response`](types.md#response) \| [`ResponseObject`](types.md#responseobject)\<`string`\> \| [`ResponseObject`](types.md#responseobject)\<\{ `error`: `string` ; `message`: `string` ; `status`: ``"error"`` = 'error' }\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`Context`](types.md#context) |
| `withRouter` | (`router`: `RouterType`\<`IRequest`, [[`Request`](types.md#request), [`Response`](types.md#response), [`DefaultLogger`](types.md#defaultlogger), [`ErrorLogger`](types.md#errorlogger)] & `any`[], [`Response`](types.md#response)\>) => `void` |
| `options` | [`Options`](types.md#options) |

#### Returns

`Promise`\<[`Response`](types.md#response) \| [`ResponseObject`](types.md#responseobject)\<`string`\> \| [`ResponseObject`](types.md#responseobject)\<\{ `error`: `string` ; `message`: `string` ; `status`: ``"error"`` = 'error' }\>\>

#### Defined in

[src/main.ts:76](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/src/main.ts#L76)

___

### runRouter

▸ **runRouter**(`router`, `«destructured»`): `Promise`\<[`Response`](types.md#response)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `router` | `RouterType`\<`IRequest`, [[`Request`](types.md#request), [`Response`](types.md#response), [`DefaultLogger`](types.md#defaultlogger), [`ErrorLogger`](types.md#errorlogger)] & `any`[], [`Response`](types.md#response)\> |
| `«destructured»` | [`Context`](types.md#context) |

#### Returns

`Promise`\<[`Response`](types.md#response)\>

#### Defined in

[src/main.ts:53](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/src/main.ts#L53)

___

### tracePrototypeChainOf

▸ **tracePrototypeChainOf**(`object`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `object` | `object` |

#### Returns

`string`

#### Defined in

[src/main.ts:20](https://github.com/kaibun/appwrite-fn-router/blob/dcd860b/src/main.ts#L20)
