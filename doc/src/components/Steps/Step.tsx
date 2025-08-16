import React, { ReactNode } from 'react';

import { useStep, useStepMode } from './StepProvider';
import { scrollToWithHeaderOffset } from '../TriggerFunction/scrollToWithHeaderOffset';

interface StepProps {
  number: number;
  children: (opts: { next: () => void; isActive: boolean }) => ReactNode;
}

const Step: React.FC<StepProps> = ({ number, children }) => {
  const { currentStep, nextStep, maxStepReached } = useStep();
  // const { stepByStep } = useStepMode();
  const isActive = currentStep === number;
  // Scroll automatique vers l’étape activée (par next ou clic TOC)
  React.useEffect(() => {
    if (isActive) {
      const el = document.getElementById(`step-anchor-${number}`);
      if (el) {
        scrollToWithHeaderOffset(el);
      }
    }
  }, [isActive, number]);

  if (maxStepReached < number) return null;

  return (
    <div
      id={`step-anchor-${number}`}
      style={{
        paddingTop: '2em', //scrollMarginTop: 80
      }}
    >
      {children({ next: nextStep, isActive })}
    </div>
  );
};

export default Step;
