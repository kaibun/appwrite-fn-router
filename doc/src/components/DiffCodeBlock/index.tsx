/**
 * @packageDocumentation
 *
 * This module provides a chain of React components for rendering code diffs and
 * code blocks in Docusaurus documentation. The main components are:
 *
 * - DiffCodeBlock: Renders a code block with optional diff highlighting
 *   (added/removed lines), collapsible via the title. Accepts before/after/diff/
 *   children props for flexible rendering.
 * - FoldableCodeBlock: Renders a _single_ block of code (or diff) with
 *   fold/unfold logic for unchanged lines, used to compact large diffs and
 *   improve readability.
 * - FoldableDiffCodeBlock: Splits a diff into logical blocks and renders each
 *   with FoldableCodeBlock, providing a step-by-step, foldable diff experience
 *   for tutorials or API docs. This is the recommended component to use.
 *
 * These components are designed to be composable and to support advanced
 * pedagogical use cases, such as incremental code tutorials, step-by-step diffs,
 * and interactive code documentation.
 *
 * Usage:
 *   - Use DiffCodeBlock for single code blocks or simple diffs.
 *   - Use FoldableDiffCodeBlock for multi-block, foldable diffs in tutorials.
 *
 * All CodeBlock props are supported via prop drilling, allowing for
 * customization and theming. Additional props are specific to the components,
 * especially diff and rendering-related props.
 */

import React, { useState, useEffect, useRef } from 'react';
import type { Props as CodeBlockProps } from '@theme/CodeBlock';
import CodeBlock from '@theme/CodeBlock';
import { diffLines } from 'diff';

import { addMagicCommentsToDiff } from './diffFoldUtils';

export interface DiffCodeBlockProps extends Omit<CodeBlockProps, 'children'> {
  readonly children?: React.ReactNode;
  before?: string;
  after?: string;
  diff?: string;
  disableDiff?: boolean;
  defaultCollapsed?: boolean;
  shrink?: boolean;
}

/**
 * Displays a code block with automatic diff highlighting (added/removed lines
 * ie. edited lines are treated as an add/remove couple).
 *
 * Rendering logic:
 *
 * - If both `before` and `after` props are defined, we generate a diff using
 *   `diffLines`, then build the code string line by line, prefixing additions
 *   with '+', removals with '-', and leaving unchanged lines as-is. Those
 *   special prefixes are used to generate magic comments driving syntax
 *   highlighting at a later stage with CSS.
 * - If `disableDiff` prop is true, we do not compute or render a diff:
 *   - If `children` is provided, we use it as the code to render (not a diff, just code).
 *   - If `children` is not provided, we fallback to `after` (if present),
 *     or an empty string if nothing is available.
 * - Otherwise, we aim for a `diff` prop (ie. the diff was precomputed upstream,
 *   so we render it directly), or we fallback to an empty string.
 *
 * In summary, this component is designed to render either:
 *
 * - a code diff (computed from `before`/`after`, or provided as `diff`),
 * - or a plain code block (from `children` or `after`).
 *
 * So really the component should be named _Diffable_CodeBlock, but hey!
 *
 * Also, the code is collapsible, ie. users can click on the title to
 * expand/collapse the code block. So it’s not about (un)folding code lines
 * within the code block itself, for that see `FoldableDiffCodeBlock` which
 * provides that additional, automated feature to the rendered diff.
 */
const DiffCodeBlock: React.FC<DiffCodeBlockProps> = ({
  children,
  before,
  after,
  diff,
  language = 'typescript',
  disableDiff = false,
  defaultCollapsed = false,
  shrink = false,
  ...props
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const codeBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);

  useEffect(() => {
    if (codeBlockRef.current) {
      const titleEl = codeBlockRef.current.querySelector(
        '[class*="codeBlockTitle"]'
      ) as HTMLElement | null;
      if (titleEl) {
        titleEl.style.cursor = 'pointer';
        titleEl.onclick = () => setIsCollapsed((v) => !v);
      }
      const contentEl = codeBlockRef.current.querySelector(
        '[class*="codeBlockContent"]'
      ) as HTMLElement | null;
      if (contentEl) {
        contentEl.style.display = isCollapsed ? 'none' : '';
      }
    }
    return () => {
      if (codeBlockRef.current) {
        const titleEl = codeBlockRef.current.querySelector(
          '[class*="codeBlockTitle"]'
        ) as HTMLElement | null;
        if (titleEl) titleEl.onclick = null;
        const contentEl = codeBlockRef.current.querySelector(
          '[class*="codeBlockContent"]'
        ) as HTMLElement | null;
        if (contentEl) contentEl.style.display = '';
      }
    };
  }, [codeBlockRef, isCollapsed]);

  let code = '';
  if (before !== undefined && after !== undefined) {
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
  } else if (disableDiff) {
    if (children) {
      code = typeof children === 'string' ? children : '';
    } else {
      code = after || '';
    }
  } else {
    if (children) {
      code = typeof children === 'string' ? children : '';
    } else {
      code = diff || '';
    }
  }

  const codeWithMagic = disableDiff ? code : addMagicCommentsToDiff(code);

  return (
    <div
      className={['diffCodeBlock', shrink ? 'shrink' : ''].join(' ')}
      ref={codeBlockRef}
    >
      <CodeBlock {...props} language={language}>
        {codeWithMagic.trimEnd()}
      </CodeBlock>
    </div>
  );
};

export default DiffCodeBlock;
