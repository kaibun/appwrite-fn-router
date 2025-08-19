import { ReactNode, useEffect } from 'react';
import { useStepMode } from './StepProvider';

import { useStep } from './StepProvider';
import { scrollToWithHeaderOffset } from '@site/src/components/TriggerFunction/utils/scrollToWithHeaderOffset';

interface StepProps {
  number: number;
  children: (opts: { next: () => void; isActive: boolean }) => ReactNode;
}

const Step: React.FC<StepProps> = ({ number, children }) => {
  const { currentStep, nextStep, maxStepReached } = useStep();
  const { stepByStep } = useStepMode();
  // If stepByStep is disabled, simulate maxStepReached = 10
  const effectiveMaxStep = stepByStep ? maxStepReached : 10;
  const isActive = currentStep === number;
  // Automatically scroll to the activated step (via next or TOC click)
  useEffect(() => {
    if (isActive) {
      const el = document.getElementById(`step-anchor-${number}`);
      if (el) {
        scrollToWithHeaderOffset(el);
      }
    }
  }, [isActive, number]);

  // Show all steps if stepByStep is disabled
  if (effectiveMaxStep < number) return null;

  return (
    <div
      id={`step-anchor-${number}`}
      style={{
        paddingTop: '2em', // scrollMarginTop: 80
      }}
    >
      {children({ next: nextStep, isActive })}
    </div>
  );
};

export default Step;
