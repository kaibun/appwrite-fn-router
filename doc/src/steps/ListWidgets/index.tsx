import { useState } from 'react';
import { useUIContext } from '@src/theme/UIContext';
import FoldableDiffCodeBlock from '@site/src/components/DiffCodeBlock/FoldableDiffCodeBlock';
import TriggerFunction from '@src/components/TriggerFunction';
import { TRIGGER_API_BASE_URL } from '@src/components/TriggerFunction/config';
import zones from './zones';

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

  return (
    <>
      <h2>{t.step3Title}</h2>
      <div style={{ position: 'relative' }}>
        <FoldableDiffCodeBlock
          before={
            require('!!raw-loader!@site/src/code-examples/main.example.ts.txt')
              .default
          }
          after={
            require('!!raw-loader!@site/src/code-examples/list-widgets.example.ts.txt')
              .default
          }
          language="typescript"
          blockId="codeblock-step3"
          codeZones={zones}
        />
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
