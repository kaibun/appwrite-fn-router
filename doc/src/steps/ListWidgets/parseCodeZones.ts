// Parser des magic comments pour extraire les zones et nettoyer le code
// Parser magic comments to extract zones and clean the code
export function parseCodeZones(code: string) {
  const lines = code.split('\n');
  const zones: Record<string, number[]> = {};
  let currentZone: string | null = null;
  const cleanLines: string[] = [];

  lines.forEach((line, idx) => {
    const start = line.match(/\/\/ zone-start:(\w+)/);
    const end = line.match(/\/\/ zone-end:(\w+)/);
    if (start) {
      currentZone = start[1];
      zones[currentZone] = [];
      return; // Ne pas inclure la ligne de magic comment
    }
    if (end) {
      currentZone = null;
      return;
    }
    if (currentZone) {
      zones[currentZone].push(idx + 1); // nth-child est 1-based
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
