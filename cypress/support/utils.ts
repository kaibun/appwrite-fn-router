import type { Widget } from '@/types/widget';

export function isValidWidget(body: unknown): body is Widget {
  const widget = body as Widget;
  return (
    widget &&
    typeof widget.$id === 'string' &&
    typeof widget.color === 'string' &&
    typeof widget.weight === 'number'
  );
}

export function isValidWidgetArray(body: unknown): body is Widget[] {
  if (!Array.isArray(body)) {
    return false;
  }
  return body.every(isValidWidget);
}
