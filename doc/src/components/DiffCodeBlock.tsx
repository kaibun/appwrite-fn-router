import CodeBlock from '@theme/CodeBlock';

import { addMagicCommentsToDiff } from './DiffCodeBlock/diffFoldUtils';

export interface DiffCodeBlockProps {
  before?: string;
  after?: string;
  diff?: string; // Optional: raw patch/diff string
  language?: string;
  title?: string;
  disableDiff?: boolean;
}

// Uses jsdiff to compute the diff (added, removed, changed)
import { diffLines } from 'diff';

/**
 * Displays a code block with automatic diff highlighting (add, change, remove).
 *
 * - If before/after are provided, computes the diff.
 * - If diff is provided, displays it as-is.
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
        // Add lines with '+' prefix
        code += part.value
          .split('\n')
          .map((line: string, i: number, arr: string[]) =>
            line.trim() === '' && i === arr.length - 1 ? '' : `+${line}`
          )
          .join('\n');
      } else if (part.removed) {
        // Remove lines with '-' prefix
        code += part.value
          .split('\n')
          .map((line: string, i: number, arr: string[]) =>
            line.trim() === '' && i === arr.length - 1 ? '' : `-${line}`
          )
          .join('\n');
      } else {
        // Unchanged lines
        code += part.value;
      }
    }
  }

  const codeWithMagic = addMagicCommentsToDiff(code);

  return (
    <CodeBlock language={language} title={title}>
      {codeWithMagic.trimEnd()}
    </CodeBlock>
  );
};

export default DiffCodeBlock;
