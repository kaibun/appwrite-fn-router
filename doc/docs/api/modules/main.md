---
id: "main"
title: "Module: main"
sidebar_label: "main"
sidebar_position: 0
custom_edit_url: null
---

## Type Aliases

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

[main.ts:20](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/main.ts#L20)

___

### WrapperRequestType

Ƭ **WrapperRequestType**: `IRequest`

#### Defined in

[main.ts:53](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/main.ts#L53)

## Functions

### createRouter

▸ **createRouter**(`«destructured»?`): `RouterType`\<`IRequest`, [[`Request`](env.md#request), [`Response`](env.md#response), [`DefaultLogger`](env.md#defaultlogger), [`ErrorLogger`](env.md#errorlogger)] & `any`[], [`ResponseObject`](env.md#responseobject)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `RouterOptions`\<`IRequest`, [[`Request`](env.md#request), [`Response`](env.md#response), [`DefaultLogger`](env.md#defaultlogger), [`ErrorLogger`](env.md#errorlogger)] & `any`[]\> |

#### Returns

`RouterType`\<`IRequest`, [[`Request`](env.md#request), [`Response`](env.md#response), [`DefaultLogger`](env.md#defaultlogger), [`ErrorLogger`](env.md#errorlogger)] & `any`[], [`ResponseObject`](env.md#responseobject)\>

#### Defined in

[main.ts:56](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/main.ts#L56)

___

### handleRequest

▸ **handleRequest**(`context`, `withRouter`, `options?`): `Promise`\<[`ResponseObject`](env.md#responseobject)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | [`Context`](env.md#context) |
| `withRouter` | (`router`: `RouterType`\<`IRequest`, [[`Request`](env.md#request), [`Response`](env.md#response), [`DefaultLogger`](env.md#defaultlogger), [`ErrorLogger`](env.md#errorlogger)] & `any`[], [`ResponseObject`](env.md#responseobject)\>) => `void` |
| `options` | [`Options`](main.md#options) |

#### Returns

`Promise`\<[`ResponseObject`](env.md#responseobject)\>

#### Defined in

[main.ts:135](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/main.ts#L135)

___

### runRouter

▸ **runRouter**(`router`, `«destructured»`): `Promise`\<[`ResponseObject`](env.md#responseobject)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `router` | `RouterType`\<`IRequest`, [[`Request`](env.md#request), [`Response`](env.md#response), [`DefaultLogger`](env.md#defaultlogger), [`ErrorLogger`](env.md#errorlogger)] & `any`[], [`ResponseObject`](env.md#responseobject)\> |
| `«destructured»` | [`Context`](env.md#context) |

#### Returns

`Promise`\<[`ResponseObject`](env.md#responseobject)\>

#### Defined in

[main.ts:73](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/main.ts#L73)

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

[main.ts:38](https://github.com/kaibun/appwrite-fn-router/blob/2df5bed/src/main.ts#L38)
