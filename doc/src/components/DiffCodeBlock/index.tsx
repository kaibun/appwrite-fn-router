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
import { parseCodeZones } from '@src/steps/ListWidgets/parseCodeZones';
// Magic zone parser (copié depuis parseCodeZones)
// function parseCodeZones(code: string) {
//   const lines = code.split('\n');
//   const zones: Record<string, number[]> = {};
//   let currentZone: string | null = null;
//   const cleanLines: string[] = [];
//   const magicCommentRegex =
//     /\/\/ (highlight-next-line|highlight-start|highlight-end|zone-start:(\w+)|zone-end:(\w+))/;
//   lines.forEach((line) => {
//     if (magicCommentRegex.test(line)) {
//       const start = line.match(/\/\/ zone-start:(\w+)/);
//       const end = line.match(/\/\/ zone-end:(\w+)/);
//       if (start) {
//         currentZone = start[1];
//         zones[currentZone] = [];
//       }
//       if (end) {
//         currentZone = null;
//       }
//       return;
//     }
//     if (currentZone) {
//       zones[currentZone].push(cleanLines.length + 1);
//     }
//     cleanLines.push(line);
//   });
//   return { code: cleanLines.join('\n'), zones };
// }
import type { Props as CodeBlockProps } from '@theme/CodeBlock';
import CodeBlock from '@theme/CodeBlock';
import { diffLines } from 'diff';

import { addMagicCommentsToDiff } from './diffFoldUtils';
import { CodeZone } from '@site/src/steps/ListWidgets/zones';

export interface DiffCodeBlockProps extends Omit<CodeBlockProps, 'children'> {
  readonly children?: React.ReactNode;
  before?: string;
  after?: string;
  diff?: string;
  disableDiff?: boolean;
  defaultCollapsed?: boolean;
  shrink?: boolean;
  codeZones?: CodeZone[];
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
  codeZones,
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
    console.log('--- Computing diff from before & after');
    const diffResult = diffLines(before, after);
    for (const part of diffResult) {
      if (part.added) {
        code += part.value
          .split('\n')
          .map((line: string, i: number, arr: string[]) =>
            line.trim() === '' && i === arr.length - 1 ? '' : `+${line}`
          )
          .join('\n');
      } else if (part.removed) {
        code += part.value
          .split('\n')
          .map((line: string, i: number, arr: string[]) =>
            line.trim() === '' && i === arr.length - 1 ? '' : `-${line}`
          )
          .join('\n');
      } else {
        code += part.value;
      }
    }
  } else if (disableDiff) {
    if (children) {
      console.log('--- Disabled diff w/ children');
      code = typeof children === 'string' ? children : '';
    } else {
      console.log('--- Disabled diff w/o children, using after');
      code = after || '';
    }
  } else {
    if (children) {
      console.log('--- Direct children');
      code = typeof children === 'string' ? children : '';
    } else {
      console.log('--- Using diff');
      code = diff || '';
    }
  }

  // Parse zones sur le code annoté
  const { code: codeWithoutZones, zones } = parseCodeZones(code);

  // Ajoute les magic comments pour Prism
  const codeWithDiffMagicComments = disableDiff
    ? code
    : addMagicCommentsToDiff(codeWithoutZones);

  // Attribue anchor-name dynamiquement sur la bonne ligne .token-line
  useEffect(() => {
    if (!zones || !Object.keys(zones).length) return;
    if (!codeBlockRef.current) return;
    const lines = codeBlockRef.current.querySelectorAll('.token-line');
    Object.entries(zones).forEach(([zoneId, lineNumbers]) => {
      lineNumbers.forEach((n) => {
        const line = lines[n - 1];
        if (line) {
          line.setAttribute('anchor-name', `--zone-${zoneId}`);
        }
      });
    });
  }, [zones, codeBlockRef]);

  /**
   * This component displays a popup for a specific code zone, identified by
   * magic comments in the code. It uses CSS Anchor Positioning, which allows
   * the popup to be positioned relative to the code line (a polyfill may have
   * been loaded by Docusaurus if need be).
   *
   * @param lineIndex The index of the line within the code block.
   * @param content The content to display in the popup.
   * @param forceVisible Whether to force the popup to be visible (for testing).
   * @returns A React component that renders the popup when visible.
   */
  function CodeZonePopup({
    lineIndex,
    content,
    forceVisible = false,
  }: {
    lineIndex: number;
    content: React.ReactNode;
    forceVisible?: boolean; // force visibility for testing and debugging
  }) {
    const [visible, setVisible] = useState(forceVisible || false);
    const popupRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (!codeBlockRef.current) return;
      const lines = codeBlockRef.current.querySelectorAll('.token-line');
      const line = lines[lineIndex];
      if (!line) return;
      const showPopup = () => setVisible(true);
      const hidePopup = () => setVisible(false);
      line.addEventListener('mouseenter', showPopup);
      line.addEventListener('mouseleave', hidePopup);
      return () => {
        line.removeEventListener('mouseenter', showPopup);
        line.removeEventListener('mouseleave', hidePopup);
      };
    }, [lineIndex]);
    const anchorName = `--zone-${Object.keys(zones)[0]}`;
    const style: React.CSSProperties = {
      background: '#fff',
      border: '1px solid #ccc',
      padding: 8,
      zIndex: 1000,
      position: 'absolute',
      // @ts-ignore
      positionAnchor: anchorName,
      insetBlockStart: 'anchor(bottom)',
      insetInlineStart: 'anchor(left)',
    };
    return forceVisible || visible ? (
      <div ref={popupRef} style={style}>
        {content}
      </div>
    ) : null;
  }

  return (
    <div
      className={['diffCodeBlock', shrink ? 'shrink' : ''].join(' ')}
      ref={codeBlockRef}
    >
      <CodeBlock {...props} language={language}>
        {codeWithDiffMagicComments.trimEnd()}
      </CodeBlock>
      {/* Popups pour chaque zone, avec contenu issu de codeZones */}
      {Object.entries(zones).map(([zoneId, lineNumbers]) => {
        const zoneObj = codeZones?.find((z) => z.id === zoneId);
        return lineNumbers.map((n, i) => (
          <CodeZonePopup
            key={`${zoneId}-${n}`}
            lineIndex={n - 1} // n est 1-based, NodeList est 0-based
            content={zoneObj?.content || <span>Zone: {zoneId}</span>}
          />
        ));
      })}
    </div>
  );
};

export default DiffCodeBlock;
