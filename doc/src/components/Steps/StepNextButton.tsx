import { useStep } from './StepProvider';
import { useUIContext } from '../../theme/UIContext';
import './StepNextButton.flash.css';
import './StepNextButton.arrow.css';

interface StepNextButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  stepNumber?: number; // Optional, otherwise uses currentStep
  disabled?: boolean;
}

const StepNextButton: React.FC<StepNextButtonProps> = ({
  onClick,
  children,
  stepNumber,
  disabled = false,
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
      disabled={disabled}
      style={{
        position: 'relative',
        background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)',
        color: '#fff',
        border: '2px solid #3b82f6',
        borderRadius: 8,
        padding: '10px 16px',
        fontWeight: 700,
        fontSize: 16,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: '0 2px 8px 0 rgba(59,130,246,0.10)',
        marginTop: 18,
        marginBottom: 8,
        opacity: disabled ? 0.6 : 1,
        transition: 'background 0.2s, box-shadow 0.2s, opacity 0.2s',
        outline: 'none',
        overflow: 'hidden',
      }}
      className="step-next-shimmer step-next-flash"
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
        {children || t.stepByStepNext}
        <span
          className="step-next-arrow-group"
          aria-hidden="true"
          style={{
            position: 'relative',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <span
            className="step-next-arrow-ghost"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 22,
              height: 22,
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 11h8m0 0l-3.5-3.5M15 11l-3.5 3.5"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="step-next-arrow">
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7 11h8m0 0l-3.5-3.5M15 11l-3.5 3.5"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </span>
      </span>
    </button>
  );
};

export default StepNextButton;
