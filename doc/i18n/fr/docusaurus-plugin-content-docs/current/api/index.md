---
id: "index"
title: "@kaibun/appwrite-fn-router"
sidebar_label: "Table of Contents"
sidebar_position: 0.5
hide_table_of_contents: true
custom_edit_url: null
---

## Functions

### createRouter

▸ **createRouter**(`«destructured»?`): `RouterType`\<`IRequest`, [`Request`, `Response`, `DefaultLogger`, `ErrorLogger`] & `any`[], `Response`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `RouterOptions`\<`IRequest`, [`Request`, `Response`, `DefaultLogger`, `ErrorLogger`] & `any`[]\> |

#### Returns

`RouterType`\<`IRequest`, [`Request`, `Response`, `DefaultLogger`, `ErrorLogger`] & `any`[], `Response`\>

#### Defined in

[main.ts:37](https://github.com/kaibun/appwrite-fn-router/blob/29a0d67/src/main.ts#L37)

___

### handleRequest

▸ **handleRequest**(`context`, `withRouter`, `options?`): `Promise`\<`Response` \| `ResponseObject`\<`string`\> \| `ResponseObject`\<\{ `error`: `string` ; `message`: `string` ; `status`: ``"error"`` = 'error' }\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `Context` |
| `withRouter` | (`router`: `RouterType`\<`IRequest`, [`Request`, `Response`, `DefaultLogger`, `ErrorLogger`] & `any`[], `Response`\>) => `void` |
| `options` | `Options` |

#### Returns

`Promise`\<`Response` \| `ResponseObject`\<`string`\> \| `ResponseObject`\<\{ `error`: `string` ; `message`: `string` ; `status`: ``"error"`` = 'error' }\>\>

#### Defined in

[main.ts:76](https://github.com/kaibun/appwrite-fn-router/blob/29a0d67/src/main.ts#L76)

___

### runRouter

▸ **runRouter**(`router`, `«destructured»`): `Promise`\<`Response`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `router` | `RouterType`\<`IRequest`, [`Request`, `Response`, `DefaultLogger`, `ErrorLogger`] & `any`[], `Response`\> |
| `«destructured»` | `Context` |

#### Returns

`Promise`\<`Response`\>

#### Defined in

[main.ts:53](https://github.com/kaibun/appwrite-fn-router/blob/29a0d67/src/main.ts#L53)

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

[main.ts:20](https://github.com/kaibun/appwrite-fn-router/blob/29a0d67/src/main.ts#L20)
