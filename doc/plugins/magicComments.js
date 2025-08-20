export default [
  // Conserver le highlight classique
  {
    className: 'theme-code-block-highlighted-line',
    line: 'highlight-next-line',
    block: { start: 'highlight-start', end: 'highlight-end' },
  },
  // Ligne ajoutée (vert)
  {
    className: 'code-block-added-line',
    line: 'added-next-line',
    block: { start: 'added-start', end: 'added-end' },
  },
  // Ligne modifiée (bleu)
  {
    className: 'code-block-modified-line',
    line: 'modified-next-line',
    block: { start: 'modified-start', end: 'modified-end' },
  },
  // Ligne supprimée (rouge, style barré)
  {
    className: 'code-block-removed-line',
    line: 'removed-next-line',
    block: { start: 'removed-start', end: 'removed-end' },
  },
  // Ligne non modifiée
  {
    className: 'code-block-unchanged-line',
    line: 'unchanged-next-line',
    block: { start: 'unchanged-start', end: 'unchanged-end' },
  },
];
