import { useStep } from './StepProvider';
import { useUIContext } from '../../theme/UIContext';

interface StepNextButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  stepNumber?: number; // Optional, otherwise uses currentStep
}

const StepNextButton: React.FC<StepNextButtonProps> = ({
  onClick,
  children,
  stepNumber,
}) => {
  const { currentStep } = useStep();
  const { t } = useUIContext();
  // If stepNumber is provided, show the button iif currentStep === stepNumber
  // Otherwise, show if currentStep === currentStep (always true)
  const shouldShow = stepNumber ? currentStep === stepNumber : true;
  if (!shouldShow) return null;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        padding: '10px 28px',
        fontWeight: 700,
        fontSize: 16,
        cursor: 'pointer',
        boxShadow: '0 2px 8px 0 rgba(59,130,246,0.10)',
        marginTop: 18,
        marginBottom: 8,
        transition: 'background 0.2s, box-shadow 0.2s',
        outline: 'none',
      }}
    >
      {children || t.stepByStepNext}
    </button>
  );
};

export default StepNextButton;
