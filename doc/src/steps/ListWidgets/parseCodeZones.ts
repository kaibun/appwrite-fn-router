import magicComments from '@site/plugins/magicComments';

// Parser magic comments to extract zones and clean the code
export function parseCodeZones(code: string) {
  const lines = code.split('\n');
  const zones: Record<string, number[]> = {};
  let currentZone: string | null = null;
  const cleanLines: string[] = [];

  const prismMagicComments = magicComments || [];
  const magicCommentKeywords = [
    // Docusaurus’ native magic comments
    'highlight-next-line',
    'highlight-start',
    'highlight-end',
    // Our custom "zones" magic comments
    'zone-start',
    'zone-end',
    // Our Prism-related magic comments
    ...prismMagicComments
      .flatMap((mc: any) => [mc.line, mc.block?.start, mc.block?.end])
      .filter(Boolean),
  ];
  const magicCommentRegex = new RegExp(
    `^\\s*\\/\\/\\s*(${magicCommentKeywords.join('|')})(:|\\s|$)`
  );

  lines.forEach((line) => {
    // Ignore toutes les lignes de magic comments
    if (magicCommentRegex.test(line)) {
      // Gestion des zones
      const start = line.match(/\/\/ zone-start:(\w+)/);
      const end = line.match(/\/\/ zone-end:(\w+)/);
      if (start) {
        currentZone = start[1];
        zones[currentZone] = [];
      }
      if (end) {
        currentZone = null;
      }
      return;
    }
    // Only increment clean line index for non-magic lines
    if (currentZone) {
      zones[currentZone].push(cleanLines.length + 1); // nth-child is 1-based
    }
    cleanLines.push(line);
  });

  return {
    code: cleanLines.join('\n'),
    zones,
  };
}

// Génère les sélecteurs CSS pour chaque zone
// Generates CSS selectors for each zone
export function generateZoneSelectors(zones: Record<string, number[]>) {
  return Object.fromEntries(
    Object.entries(zones).map(([id, lines]) => [
      id,
      lines.map((n) => `.token-line:nth-child(${n})`).join(', '),
    ])
  );
}
