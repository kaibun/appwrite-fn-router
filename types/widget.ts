// Shared Widget types and validation functions

export type Widget = {
  id: string;
  weight: number;
  color: 'red' | 'blue' | 'gold';
};

// Type guards for validation
export const isValidWidget = (obj: any): obj is Widget => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'string' &&
    typeof obj.weight === 'number' &&
    ['red', 'blue', 'gold'].includes(obj.color)
  );
};

export const isValidWidgetArray = (obj: any): obj is Widget[] => {
  return Array.isArray(obj) && obj.every(isValidWidget);
};
