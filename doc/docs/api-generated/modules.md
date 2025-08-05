[@kaibun/appwrite-fn-router](README.md) / Exports

# @kaibun/appwrite-fn-router

## Table of contents

### Type Aliases

- [Options](modules.md#options)
- [WrapperRequestType](modules.md#wrapperrequesttype)

### Functions

- [createRouter](modules.md#createrouter)
- [handleRequest](modules.md#handlerequest)
- [runRouter](modules.md#runrouter)
- [tracePrototypeChainOf](modules.md#traceprototypechainof)

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

[main.ts:20](https://github.com/kaibun/appwrite-fn-router/blob/8b464f8f7ad1b05ec409c766c21fbcb06610255d/src/main.ts#L20)

___

### WrapperRequestType

Ƭ **WrapperRequestType**: `IRequest`

#### Defined in

[main.ts:50](https://github.com/kaibun/appwrite-fn-router/blob/8b464f8f7ad1b05ec409c766c21fbcb06610255d/src/main.ts#L50)

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

[main.ts:53](https://github.com/kaibun/appwrite-fn-router/blob/8b464f8f7ad1b05ec409c766c21fbcb06610255d/src/main.ts#L53)

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

[main.ts:132](https://github.com/kaibun/appwrite-fn-router/blob/8b464f8f7ad1b05ec409c766c21fbcb06610255d/src/main.ts#L132)

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

[main.ts:70](https://github.com/kaibun/appwrite-fn-router/blob/8b464f8f7ad1b05ec409c766c21fbcb06610255d/src/main.ts#L70)

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

[main.ts:35](https://github.com/kaibun/appwrite-fn-router/blob/8b464f8f7ad1b05ec409c766c21fbcb06610255d/src/main.ts#L35)
