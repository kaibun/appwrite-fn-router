import { useState } from 'react';
import { Tour } from '@reactour/tour';
import { useUIContext } from '@src/theme/UIContext';
import DiffCodeBlockFoldable from '@site/src/components/DiffCodeBlock/FoldableDiffCodeBlock';
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
  const [tourMode, setTourMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [disabledActions, setDisabledActions] = useState(false);

  // Get code example and parse zones
  const codeRaw =
    require('!!raw-loader!@site/src/code-examples/list-widgets.example.ts.txt').default;
  const { code: codeClean, zones } = parseCodeZones(codeRaw);
  const selectors = generateZoneSelectors(zones);

  // Synchronize explanations with selectors
  const zoneData = codeZones.map((zone) => ({
    ...zone,
    selector: selectors[zone.id] || '',
  }));

  // Steps for Reactour
  const tourSteps = zoneData.map((zone) => ({
    selector: zone.selector,
    content: (
      <div style={{ maxWidth: 320 }}>
        <h4>{zone.title}</h4>
        {zone.content}
      </div>
    ),
  }));

  return (
    <>
      <h2>{t.step3Title}</h2>
      <div style={{ marginBottom: 8 }}>
        <button
          type="button"
          onClick={() => setTourMode(true)}
          disabled={tourMode}
          style={{ marginRight: 8 }}
        >
          Démarrer le tour interactif
        </button>
        <span>
          {tourMode
            ? 'Interactive tour (Reactour)'
            : 'Accessible explanations (PanelGroup)'}
        </span>
      </div>
      {/* Code block with zones highlighted (to be implemented) */}
      <DiffCodeBlockFoldable
        before={
          require('!!raw-loader!@site/src/code-examples/main.example.ts.txt')
            .default
        }
        after={codeClean}
        language="typescript"
      />
      {/* UI mode: Reactour or PanelGroup (to be implemented) */}
      {tourMode ? (
        <Tour
          steps={tourSteps}
          isOpen={tourMode}
          setIsOpen={setTourMode}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          disabledActions={disabledActions}
          setDisabledActions={setDisabledActions}
        />
      ) : (
        <div>
          {/* PanelGroup: all explanations visible, zones highlighted */}
          {zoneData.map((zone) => (
            <div key={zone.id} style={{ marginBottom: 16 }}>
              <h4>{zone.title}</h4>
              {zone.content}
              <div>
                <small>
                  Selector: <code>{zone.selector}</code>
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
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
