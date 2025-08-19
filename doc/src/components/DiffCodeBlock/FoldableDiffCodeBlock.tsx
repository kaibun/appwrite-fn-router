import React from 'react';

import type { DiffCodeBlockProps } from './index';
import type { FoldableCodeBlockProps } from './FoldableCodeBlock';
import DiffCodeBlock from './index';
import FoldableCodeBlock from './FoldableCodeBlock';
import { splitDiffIntoBlocks } from './diffFoldUtils';

export interface FoldableDiffCodeBlockProps
  extends Omit<DiffCodeBlockProps, 'children'>,
    Omit<FoldableCodeBlockProps, 'children' | 'block'> {
  before: string;
  after: string;
  contextBefore?: number;
  contextAfter?: number;
  contextStart?: number;
  contextEnd?: number;
  foldThreshold?: number;
}

/**
 * LCS (Longest Common Subsequence) algorithm for smarter diff.
 * Finds the longest sequence of lines present in both files in order.
 * This helps detect unchanged blocks even after insertions/deletions.
 * Uses a dynamic programming table (dp) to compute the LCS length.
 * Then backtracks to reconstruct the diff output.
 *
 * Resources:
 *   https://en.wikipedia.org/wiki/Longest_common_subsequence
 *   https://neil.fraser.name/writing/diff/
 *   https://www.geeksforgeeks.org/longest-common-subsequence-dp-4/
 */
function lcsDiff(before: string, after: string): string[] {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  const n = beforeLines.length;
  const m = afterLines.length;
  // LCS table
  const dp: number[][] = Array(n + 1)
    .fill(null)
    .map(() => Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (beforeLines[i - 1] === afterLines[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  // Backtrack to build the diff
  const diffLines: string[] = [];
  let i = n,
    j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && beforeLines[i - 1] === afterLines[j - 1]) {
      diffLines.unshift(' ' + beforeLines[i - 1]);
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diffLines.unshift('+' + afterLines[j - 1]);
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diffLines.unshift('-' + beforeLines[i - 1]);
      i--;
    }
  }
  return diffLines;
}

const FoldableDiffCodeBlock: React.FC<
  FoldableDiffCodeBlockProps & { disableDiff?: boolean }
> = ({
  before,
  after,
  language = 'typescript',
  // title,
  contextBefore,
  contextAfter,
  contextStart,
  contextEnd,
  foldThreshold,
  disableDiff = false,
  ...props
}) => {
  if (disableDiff) {
    return (
      <div>
        {/* {title && <h4 style={{ marginBottom: 8 }}>{title}</h4>} */}
        {/* disableDiff is true, so eventually this will render raw (non-diff)
            code, which is what we want. */}
        <DiffCodeBlock {...props} language={language}>
          {(after || '').trimEnd()}
        </DiffCodeBlock>
      </div>
    );
  }
  const diffLines = lcsDiff(before, after);
  const blocks = splitDiffIntoBlocks(diffLines, {
    contextBefore,
    contextAfter,
    contextStart,
    contextEnd,
    foldThreshold,
  });
  return (
    <div>
      {/* {title && <h4 style={{ marginBottom: 8 }}>{title}</h4>} */}
      {blocks.map((block, idx) => (
        <FoldableCodeBlock
          {...props}
          key={idx}
          language={language}
          block={block}
          isFirst={idx === 0}
          isLast={idx === blocks.length - 1}
        />
      ))}
    </div>
  );
};

export default FoldableDiffCodeBlock;
