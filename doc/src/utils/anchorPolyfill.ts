import polyfill from '@oddbird/css-anchor-positioning/fn';

/**
 * Utility to ensure CSS Anchor Positioning support (native or polyfill).
 *
 * @link https://github.com/oddbird/css-anchor-positioning
 * @link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_anchor_positioning
 * @link https://webkit.org/blog/17240/a-gentle-introduction-to-anchor-positioning/
 */
export default async function ensureAnchorSupport() {
  const SUPPORTS_ANCHOR_POSITIONING =
    'anchorName' in document.documentElement.style;
  if (!SUPPORTS_ANCHOR_POSITIONING) {
    await polyfill();
    console.info('Loaded polyfill for CSS Anchor Positioning.');
    return true;
  }
  return true;
}
