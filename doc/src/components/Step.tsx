import React, { ReactNode } from 'react';
import { useStep, useStepMode } from './StepProvider';

interface StepProps {
  number: number;
  children: (opts: { next: () => void; isActive: boolean }) => ReactNode;
}

const Step: React.FC<StepProps> = ({ number, children }) => {
  const { currentStep, nextStep } = useStep();
  const { stepByStep } = useStepMode();
  const isActive = currentStep === number;
  // En mode pas à pas : afficher toutes les étapes débloquées (<= currentStep)
  if (currentStep < number) return null;
  // Scroll automatique vers l’étape activée (par next ou clic TOC)
  React.useEffect(() => {
    if (isActive) {
      const el = document.getElementById(`step-anchor-${number}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Fallback pour Safari/iOS ou si scroll-margin-top n'est pas pris en compte
        const headerHeight = 80;
        const rect = el.getBoundingClientRect();
        const absoluteY = window.scrollY + rect.top;
        if (Math.abs(rect.top) < 5) return;
        window.scrollTo({
          top: absoluteY - headerHeight,
          behavior: 'smooth',
        });
      }
    }
  }, [isActive, number]);
  return (
    <div id={`step-anchor-${number}`} style={{ scrollMarginTop: 80 }}>
      {children({ next: nextStep, isActive })}
    </div>
  );
};

export default Step;
