import React, { useState, useEffect, useRef } from 'react';
import CodeBlock from '@theme/CodeBlock';
import { diffLines } from 'diff';

import { addMagicCommentsToDiff } from './diffFoldUtils';

export interface DiffCodeBlockProps {
  children: React.ReactNode;
  before?: string;
  after?: string;
  diff?: string; // Optional: raw patch/diff string
  language?: string;
  title?: string;
  disableDiff?: boolean;
  defaultCollapsed?: boolean;
}

/**
 * Displays a code block with automatic diff highlighting (add, change, remove).
 *
 * - If before/after are provided, computes the diff.
 * - If diff is provided, displays it as-is.
 */
const DiffCodeBlock: React.FC<DiffCodeBlockProps> = ({
  children,
  before,
  after,
  diff,
  language = 'typescript',
  title,
  disableDiff = false,
  defaultCollapsed = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const codeBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsCollapsed(defaultCollapsed);
  }, [defaultCollapsed]);

  useEffect(() => {
    if (codeBlockRef.current) {
      // Handler sur le titre
      const titleEl = codeBlockRef.current.querySelector(
        '[class*="codeBlockTitle"]'
      ) as HTMLElement | null;
      if (titleEl) {
        titleEl.style.cursor = 'pointer';
        titleEl.onclick = () => setIsCollapsed((v) => !v);
      }
      // Masquer/afficher le contenu
      const contentEl = codeBlockRef.current.querySelector(
        '[class*="codeBlockContent"]'
      ) as HTMLElement | null;
      if (contentEl) {
        contentEl.style.display = isCollapsed ? 'none' : '';
      }
    }
    // Cleanup
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
  if (children) {
    code = typeof children === 'string' ? children : '';
  }
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
    <div ref={codeBlockRef} style={{ marginBottom: 16 }}>
      <CodeBlock language={language} title={title}>
        {codeWithMagic.trimEnd()}
      </CodeBlock>
    </div>
  );
};

export default DiffCodeBlock;
