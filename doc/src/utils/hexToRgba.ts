/**
 * Converts a hex color to RGBA format with the given opacity.
 * @param hex - Hex color string (e.g. "#DC2626" or "DC2626")
 * @param alpha - Opacity value between 0 and 1
 * @returns RGBA color string
 */
export function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace(/^#/, '');
  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
