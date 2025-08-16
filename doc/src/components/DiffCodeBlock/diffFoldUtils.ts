// Splits a diff into foldable/non-foldable blocks
// Long unchanged blocks are folded by default
export interface DiffBlock {
  code: string;
  startLine: number;
  endLine: number;
  folded: boolean;
  type: 'unchanged' | 'changed' | 'added' | 'removed';
}

/**
 * Extracts the start context block (unchanged lines at the beginning of the file).
 * Returns the lines to display and the next index to process.
 */
function extractStartContext(
  diffLines: string[],
  firstModifIdx: number,
  contextStart: number
): { lines: string[]; nextIndex: number } {
  const startLimit =
    firstModifIdx !== -1 && firstModifIdx < contextStart
      ? firstModifIdx
      : contextStart;
  return {
    lines: diffLines.slice(0, startLimit),
    nextIndex: startLimit,
  };
}

/**
 * Extracts context lines before a changed block, from the previous folded unchanged block.
 * Returns a new unfolded block if context is available.
 */
function extractBeforeContext(
  blocks: DiffBlock[],
  contextBefore: number,
  contextStart: number
): DiffBlock | null {
  if (blocks.length === 0) return null;
  const prev = blocks[blocks.length - 1];
  if (prev.type !== 'unchanged' || !prev.folded) return null;
  const prevLines = prev.code.split('\n');
  let contextCount = Math.min(contextBefore, prevLines.length);
  if (prev.endLine < contextStart) contextCount = 0;
  if (contextCount > 0) {
    const contextLines = prevLines.slice(-contextCount);
    prev.code = prevLines.slice(0, prevLines.length - contextCount).join('\n');
    prev.endLine -= contextCount;
    return {
      code: contextLines.join('\n'),
      startLine: prev.endLine + 1,
      endLine: prev.endLine + contextCount,
      folded: false,
      type: 'unchanged',
    };
  }
  return null;
}

/**
 * Extracts context lines after a changed block, from the next folded unchanged block.
 * Returns both the unfolded context block and the shortened folded block.
 */
function extractAfterContext(
  diffLines: string[],
  i: number,
  foldThreshold: number,
  contextAfter: number
): {
  contextBlock: DiffBlock;
  foldedBlock: DiffBlock;
  nextIndex: number;
} | null {
  let postStart = i;
  let postEnd = i;
  while (postEnd < diffLines.length && diffLines[postEnd].startsWith(' ')) {
    postEnd++;
  }
  const postBlockLen = postEnd - postStart;
  if (postBlockLen > foldThreshold) {
    const contextCount = Math.min(contextAfter, postBlockLen);
    if (contextCount > 0) {
      const contextLines = diffLines.slice(postStart, postStart + contextCount);
      return {
        contextBlock: {
          code: contextLines.join('\n'),
          startLine: postStart + 1,
          endLine: postStart + contextCount,
          folded: false,
          type: 'unchanged',
        },
        foldedBlock: {
          code: diffLines.slice(postStart + contextCount, postEnd).join('\n'),
          startLine: postStart + contextCount + 1,
          endLine: postEnd,
          folded: true,
          type: 'unchanged',
        },
        nextIndex: postEnd,
      };
    }
  }
  return null;
}

/**
 * Ensures the last lines of the file are always displayed as unfolded context.
 * Modifies the result array in place.
 */
function extractEndContext(result: DiffBlock[], contextEnd: number): void {
  if (result.length === 0) return;
  const last = result[result.length - 1];
  if (last.type === 'unchanged' && last.folded) {
    const lastLines = last.code.split('\n');
    const contextCount = Math.min(contextEnd, lastLines.length);
    if (contextCount > 0) {
      const contextLines = lastLines.slice(-contextCount);
      last.code = lastLines
        .slice(0, lastLines.length - contextCount)
        .join('\n');
      last.endLine -= contextCount;
      result.push({
        code: contextLines.join('\n'),
        startLine: last.endLine + 1,
        endLine: last.endLine + contextCount,
        folded: false,
        type: 'unchanged',
      });
    }
  }
}

/**
 * Orders changed lines in a diff block so that removed lines (-) appear before added lines (+).
 * This improves visual clarity when a whole block/file is replaced, by showing deletions first.
 */
function orderChangedLines(modLines: string[]): string[] {
  const removedLines = modLines.filter((line) => line.startsWith('-'));
  const addedLines = modLines.filter((line) => line.startsWith('+'));
  return [...removedLines, ...addedLines];
}

export function splitDiffIntoBlocks(
  diffLines: string[],
  {
    contextBefore = 3,
    contextAfter = 3,
    contextStart = 3,
    contextEnd = 3,
    foldThreshold = 6,
  }: {
    contextBefore?: number;
    contextAfter?: number;
    contextStart?: number;
    contextEnd?: number;
    foldThreshold?: number;
  } = {}
): DiffBlock[] {
  const blocks: DiffBlock[] = [];
  let lineNum = 1;
  let i = 0;
  let firstModifIdx = -1;
  // Find the first modified line
  for (let idx = 0; idx < diffLines.length; idx++) {
    if (diffLines[idx].startsWith('+') || diffLines[idx].startsWith('-')) {
      firstModifIdx = idx;
      break;
    }
  }
  while (i < diffLines.length) {
    // Beginning of file: always show contextStart lines
    if (i === 0) {
      const { lines, nextIndex } = extractStartContext(
        diffLines,
        firstModifIdx,
        contextStart
      );
      if (lines.length > 0) {
        blocks.push({
          code: lines.join('\n'),
          startLine: 1,
          endLine: nextIndex,
          folded: false,
          type: 'unchanged',
        });
        i = nextIndex;
        lineNum = nextIndex + 1;
        continue;
      } else {
        // If no unchanged line at the start, go directly to detecting the modified block
        i = 0;
        lineNum = 1;
      }
    }
    // Modified block
    if (diffLines[i].startsWith('+') || diffLines[i].startsWith('-')) {
      // Context before
      const beforeBlock = extractBeforeContext(
        blocks,
        contextBefore,
        contextStart
      );
      if (beforeBlock) blocks.push(beforeBlock);
      let start = i;
      while (
        i < diffLines.length &&
        (diffLines[i].startsWith('+') || diffLines[i].startsWith('-'))
      ) {
        i++;
      }
      const modLines = diffLines.slice(start, i);
      const orderedModLines = orderChangedLines(modLines);
      blocks.push({
        code: orderedModLines.join('\n'),
        startLine: start + 1,
        endLine: i,
        folded: false,
        type: orderedModLines.every((l) => l.startsWith('+'))
          ? 'added'
          : orderedModLines.every((l) => l.startsWith('-'))
            ? 'removed'
            : orderedModLines.some((l) => l.startsWith('+')) &&
                orderedModLines.some((l) => l.startsWith('-'))
              ? 'changed'
              : 'changed',
      });
      lineNum = i + 1;
      // Context after
      const afterContext = extractAfterContext(
        diffLines,
        i,
        foldThreshold,
        contextAfter
      );
      if (afterContext) {
        blocks.push(afterContext.contextBlock);
        blocks.push(afterContext.foldedBlock);
        i = afterContext.nextIndex;
        lineNum = i + 1;
        continue;
      }
      continue;
    }
    // Unchanged block
    let start = i;
    while (i < diffLines.length && diffLines[i].startsWith(' ')) {
      i++;
    }
    const blockLen = i - start;
    if (blockLen > 0) {
      blocks.push({
        code: diffLines.slice(start, i).join('\n'),
        startLine: start + 1,
        endLine: i,
        folded: blockLen > foldThreshold,
        type: 'unchanged',
      });
      lineNum = i + 1;
    }
  }
  // Cleanup: remove empty blocks
  let result = blocks.filter((b) => b.code.trim() !== '');
  // End of file: always show contextEnd lines
  extractEndContext(result, contextEnd);
  if (result.length > 0) {
    const last = result[result.length - 1];
    if (last.type === 'changed') {
      // If the last block is modified, display it as is (no unchanged context to extract)
      // Nothing to do, the modified block is already displayed
    }
  }
  return result.filter((b) => b.code.trim() !== '');
}

/**
 * Magic comments are not so magical, they simply are driving CodeBlock styles. * Check docusaurus.config.ts for the custom magic comments used here.
 *
 * @see https://docusaurus.io/docs/markdown-features/code-blocks#custom-magic-comments
 */
export function addMagicCommentsToDiff(code: string): string {
  return code
    .split('\n')
    .map((line) => {
      if (line.startsWith('+')) {
        return '// added-next-line\n' + line.slice(1);
      }
      if (line.startsWith('-')) {
        return '// removed-next-line\n' + line.slice(1);
      }
      return '// unchanged-next-line\n' + line;
    })
    .join('\n');
}
