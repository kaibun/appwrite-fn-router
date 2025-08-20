import { useState } from 'react';
import { useUIContext } from '@src/theme/UIContext';
import DiffCodeBlockFoldable from '@site/src/components/DiffCodeBlock/FoldableDiffCodeBlock';
import { useEffect, useRef } from 'react';
import TriggerFunction from '@src/components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '@src/components/TriggerFunction/config';
import { parseCodeZones, generateZoneSelectors } from './parseCodeZones';
import { codeZones } from './CodeZones';

export default function ListWidgetsStep({
  stepNumber,
  next,
}: {
  stepNumber: number;
  next: () => void;
}) {
  const { t } = useUIContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [disabledActions, setDisabledActions] = useState(false);

  // Get code example and parse zones
  const codeRaw =
    require('!!raw-loader!@site/src/code-examples/list-widgets.example.ts.txt').default;
  const { code: codeClean, zones } = parseCodeZones(codeRaw);
  const selectors = generateZoneSelectors(zones);

  // Synchronize explanations with selectors, prefixing with blockId
  const blockId = 'codeblock-step3';
  const zoneData = codeZones.map((zone) => ({
    ...zone,
    selector: selectors[zone.id] ? `#${blockId} ${selectors[zone.id]}` : '',
  }));

  // Inject anchor-name CSS for each zone line
  useEffect(() => {
    if (!zones || !Object.keys(zones).length) return;
    let css = '';
    Object.entries(zones).forEach(([zoneId, lineNumbers]) => {
      lineNumbers.forEach((n) => {
        // Anchor unique par ligne et zone
        css += `#${blockId} .token-line:nth-child(${n}) { anchor-name: --zone-${blockId}-${n - 1}; }\n`;
      });
    });
    let styleTag = document.getElementById(
      'zone-anchor-style'
    ) as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'zone-anchor-style';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = css;
  }, [zones, blockId]);

  /**
   * This component displays a popup for a specific code zone, identified by
   * magic comments in the code. It uses CSS Anchor Positioning, which allows
   * the popup to be positioned relative to the code line (a polyfill may have
   * been loaded by Docusaurus if need be).
   *
   * @param blockId The ID of the code block to which this zone belongs.
   * @param lineIndex The index of the line within the code block.
   * @param content The content to display in the popup.
   * @returns A React component that renders the popup when visible.
   */
  function CodeZonePopup({
    blockId,
    lineIndex,
    content,
  }: {
    blockId: string;
    lineIndex: number;
    content: React.ReactNode;
  }) {
    const [visible, setVisible] = useState(false);
    const popupRef = useRef(null);

    // Apply anchoring only after popup is rendered, otherwise `popupRef` is
    // not defined.
    useEffect(() => {
      if (!visible) return;
      if (!popupRef.current) return;
      const block = document.getElementById(blockId);
      if (!block) return;
      const lines = block.querySelectorAll('.token-line');
      const line = lines[lineIndex];
      if (!line) return;
      // @ts-ignore
      popupRef.current.anchorElement = line;
      // @ts-ignore
      popupRef.current.anchorSide = 'bottom';
    }, [visible, blockId, lineIndex]);

    // Then, control the popup visibility based on line events (mouseenter,
    // mouseleave) ie. hovering a zone-identified line will display its matching
    // popup.
    useEffect(() => {
      const block = document.getElementById(blockId);
      if (!block) return;
      const lines = block.querySelectorAll('.token-line');
      const line = lines[lineIndex];
      if (!line) return;

      const showPopup = () => {
        setVisible(true);
      };
      const hidePopup = () => setVisible(false);

      line.addEventListener('mouseenter', showPopup);
      line.addEventListener('mouseleave', hidePopup);

      return () => {
        line.removeEventListener('mouseenter', showPopup);
        line.removeEventListener('mouseleave', hidePopup);
      };
    }, [blockId, lineIndex]);

    const anchorName = `--zone-${blockId}-${lineIndex}`;
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

    return visible ? (
      <div ref={popupRef} style={style}>
        {content}
      </div>
    ) : null;
  }

  console.log(zoneData);
  console.log(zones);

  return (
    <>
      <h2>{t.step3Title}</h2>
      <div style={{ position: 'relative' }}>
        <DiffCodeBlockFoldable
          before={
            require('!!raw-loader!@site/src/code-examples/main.example.ts.txt')
              .default
          }
          after={codeClean}
          language="typescript"
          blockId={blockId}
        />
        {Object.entries(zones).map(([zoneId, lineIndices]) => {
          const zone = zoneData.find((z) => z.id === zoneId);
          if (!zone) return null;
          return lineIndices.map((n, i) => (
            <CodeZonePopup
              key={`${zoneId}-${n}`}
              blockId={blockId}
              lineIndex={n - 1} // nth-child est 1-based, NodeList est 0-based
              content={zone.content}
            />
          ));
        })}
      </div>
      <TriggerFunction
        method="GET"
        url={`${TRIGGER_API_BASE_URL}/widgets`}
        label={t.listWidgetsLabel}
        step={3}
        onStepDone={next}
        showDebugInfo={false}
      />
    </>
  );
}
