// Shared Widget types and validation functions

// Type Widget is now inferred from Zod schema for consistency
export { Widget } from '../../functions/Test/src/validation/widgetSchema';

// Type guards for validation
export const isValidWidget = (obj: any): obj is Widget => {
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

export const isValidWidgetArray = (obj: any): obj is Widget[] => {
  return Array.isArray(obj) && obj.every(isValidWidget);
};
