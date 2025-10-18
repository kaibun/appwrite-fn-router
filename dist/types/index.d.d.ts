export { d as AFRContext, e as AFRContextArgs, b as AFRRequest, c as AppwriteContext, A as AppwriteRequest, a as AppwriteResponse, f as AppwriteResponseObject, B as BufferFromArgTypes, C as CatchHandler, D as DefaultLogger, E as ErrorLogger, F as FinalOptions, H as Headers, I as InternalObjects, J as JSONObject, O as Options, R as RouterJSONResponse, l as logEnableFn } from '../global.d-DlsSg7Fk.js';
import { z } from 'zod';
import 'itty-router';
import 'undici';

declare const WidgetSchema: z.ZodObject<{
    $id: z.ZodString;
    $collectionId: z.ZodString;
    $databaseId: z.ZodString;
    $createdAt: z.ZodString;
    $updatedAt: z.ZodString;
    $permissions: z.ZodArray<z.ZodString>;
    $sequence: z.ZodNumber;
    weight: z.ZodNumber;
    color: z.ZodEnum<{
        red: "red";
        blue: "blue";
        gold: "gold";
    }>;
}, z.core.$strip>;
type WidgetInput = z.infer<typeof WidgetSchema>;

// Shared Widget types and validation functions



// Type guards for validation
declare const isValidWidget = (obj: any): obj is WidgetInput => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.$id === 'string' &&
    typeof obj.$collectionId === 'string' &&
    typeof obj.$databaseId === 'string' &&
    typeof obj.$createdAt === 'string' &&
    typeof obj.$updatedAt === 'string' &&
    Array.isArray(obj.$permissions) &&
    typeof obj.$sequence === 'number' &&
    typeof obj.weight === 'number' &&
    ['red', 'blue', 'gold'].includes(obj.color)
  );
};

declare const isValidWidgetArray = (obj: any): obj is WidgetInput[] => {
  return Array.isArray(obj) && obj.every(isValidWidget);
};

export { type WidgetInput, isValidWidget, isValidWidgetArray };
