---
id: "modules"
title: "@kaibun/appwrite-fn-router"
sidebar_label: "Exports"
sidebar_position: 0.5
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

[main.ts:20](https://github.com/kaibun/appwrite-fn-router/blob/e8a94b4/src/main.ts#L20)

___

### WrapperRequestType

Ƭ **WrapperRequestType**: `IRequest`

#### Defined in

[main.ts:50](https://github.com/kaibun/appwrite-fn-router/blob/e8a94b4/src/main.ts#L50)

## Functions

### createRouter

▸ **createRouter**(`«destructured»?`): `RouterType`\<`IRequest`, [`Request`, `Response`, `DefaultLogger`, `ErrorLogger`] & `any`[], `ResponseObject`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `«destructured»` | `RouterOptions`\<`IRequest`, [`Request`, `Response`, `DefaultLogger`, `ErrorLogger`] & `any`[]\> |

#### Returns

`RouterType`\<`IRequest`, [`Request`, `Response`, `DefaultLogger`, `ErrorLogger`] & `any`[], `ResponseObject`\>

#### Defined in

[main.ts:53](https://github.com/kaibun/appwrite-fn-router/blob/e8a94b4/src/main.ts#L53)

___

### handleRequest

▸ **handleRequest**(`context`, `withRouter`, `options?`): `Promise`\<`ResponseObject`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `context` | `Context` |
| `withRouter` | (`router`: `RouterType`\<`IRequest`, [`Request`, `Response`, `DefaultLogger`, `ErrorLogger`] & `any`[], `ResponseObject`\>) => `void` |
| `options` | [`Options`](modules.md#options) |

#### Returns

`Promise`\<`ResponseObject`\>

#### Defined in

[main.ts:132](https://github.com/kaibun/appwrite-fn-router/blob/e8a94b4/src/main.ts#L132)

___

### runRouter

▸ **runRouter**(`router`, `«destructured»`): `Promise`\<`ResponseObject`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `router` | `RouterType`\<`IRequest`, [`Request`, `Response`, `DefaultLogger`, `ErrorLogger`] & `any`[], `ResponseObject`\> |
| `«destructured»` | `Context` |

#### Returns

`Promise`\<`ResponseObject`\>

#### Defined in

[main.ts:70](https://github.com/kaibun/appwrite-fn-router/blob/e8a94b4/src/main.ts#L70)

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

[main.ts:35](https://github.com/kaibun/appwrite-fn-router/blob/e8a94b4/src/main.ts#L35)
