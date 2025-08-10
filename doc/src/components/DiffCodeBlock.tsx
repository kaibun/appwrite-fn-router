import React from 'react';
import CodeBlock from '@theme/CodeBlock';

export interface DiffCodeBlockProps {
  before?: string;
  after?: string;
  diff?: string; // Optionnel : patch/diff brut
  language?: string;
  title?: string;
  disableDiff?: boolean;
}

// Utilise jsdiff pour calculer le diff (ajout, suppression, modif)
import { diffLines } from 'diff';

/**
 * Affiche un bloc de code avec surlignage diff automatique (ajout, modif, suppression)
 * - Si before/after fournis, calcule le diff
 * - Si diff fourni, affiche tel quel
 */
const DiffCodeBlock: React.FC<DiffCodeBlockProps> = ({
  before,
  after,
  diff,
  language = 'typescript',
  title,
  disableDiff = false,
}) => {
  let code = '';
  if (disableDiff && after !== undefined) {
    code = after;
  } else if (diff) {
    code = diff;
  } else if (before !== undefined && after !== undefined) {
    const diffResult = diffLines(before, after);
    for (const part of diffResult) {
      if (part.added) {
        code += part.value
          .split('\n')
          .map((line: string, i: number, arr: string[]) =>
            line.trim() === '' && i === arr.length - 1
              ? ''
              : `// added-next-line\n${line}`
          )
          .join('\n');
      } else if (part.removed) {
        code += part.value
          .split('\n')
          .map((line: string, i: number, arr: string[]) =>
            line.trim() === '' && i === arr.length - 1
              ? ''
              : `// removed-next-line\n${line}`
          )
          .join('\n');
      } else {
        code += part.value;
      }
    }
  }
  return (
    <CodeBlock language={language} title={title}>
      {code.trimEnd()}
    </CodeBlock>
  );
};

export default DiffCodeBlock;
