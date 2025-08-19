import { useState, useEffect } from 'react';
import { useUIContext } from '@src/theme/UIContext';
import { useStep, useStepMode } from './StepProvider';

const stepKeys = [
  'step1Title',
  'step2Title',
  'step3Title',
  'step4Title',
  'step5Title',
  'step6Title',
  'step7Title',
  'step8Title',
  'step9Title',
  'step10Title',
];

const StepByStepToc: React.FC = () => {
  const { palette, t } = useUIContext();
  const { currentStep, goToStep, maxStepReached } = useStep();
  const { stepByStep, setStepByStep } = useStepMode();
  const colorMode = palette.mode;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle animation state to control overflow
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isAnimating) {
      // Restore overflow: auto after the animation ends (300ms)
      timeoutId = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isAnimating]);

  const handleToggle = () => {
    setIsAnimating(true);
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside
      style={{
        position: 'fixed',
        top: 100,
        right: 32,
        width: 320,
        background: palette.toRGBA(palette.inputBg, 0.95),
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        boxShadow:
          colorMode === 'dark'
            ? '0 4px 16px 0 rgba(0,0,0,0.4)'
            : '0 4px 16px 0 rgba(60, 80, 120, 0.07)',
        padding: '24px 24px 16px 24px',
        zIndex: 100,
        maxHeight: '80vh',
        // Do not use overflowY here to allow animation
        color: palette.text,
        transition: 'padding 0.3s ease-out',
      }}
      aria-label={t.stepByStepSummary}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: isCollapsed ? 0 : 16,
          transition: 'margin-bottom 0.3s ease-out',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={stepByStep}
            onChange={(e) => setStepByStep(e.target.checked)}
            id="stepbystep-toggle"
            style={{ marginRight: 8 }}
          />
          <label
            htmlFor="stepbystep-toggle"
            style={{ fontWeight: 600, fontSize: 16 }}
          >
            {t.stepByStepLabel}
          </label>
        </div>
        <button
          onClick={handleToggle}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: palette.text,
            borderRadius: '50%',
          }}
          aria-label={isCollapsed ? 'Déplier' : 'Replier'}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s ease-out',
            }}
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div
        style={{
          maxHeight: isCollapsed ? 0 : '70vh',
          overflowY: isAnimating || isCollapsed ? 'hidden' : 'auto',
          overflowX: 'hidden',
          transition: 'max-height 0.3s ease-out',
        }}
      >
        <ol style={{ listStyle: 'none', padding: 0, margin: '10px 0 0 0' }}>
          {stepKeys.map((key, idx) => {
            const stepNum = idx + 1;
            // If stepByStep is disabled, all steps are unlocked and marked as reached
            const allStepsReached = !stepByStep;
            const unlocked = allStepsReached || maxStepReached >= stepNum;
            return (
              <li
                key={stepNum}
                style={{
                  marginBottom: 10,
                  opacity: unlocked ? 1 : 0.5,
                  cursor: unlocked ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                }}
                onClick={() => {
                  if (!unlocked) return;
                  goToStep(stepNum);
                  setTimeout(() => {
                    const el = document.getElementById(
                      `step-anchor-${stepNum}`
                    );
                    if (el) {
                      el.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                      });
                      const headerHeight = 80;
                      const rect = el.getBoundingClientRect();
                      const absoluteY = window.scrollY + rect.top;
                      if (Math.abs(rect.top) < 5) {
                        return;
                      }
                      window.scrollTo({
                        top: absoluteY - headerHeight,
                        behavior: 'smooth',
                      });
                    }
                  }, 50);
                }}
                aria-current={currentStep === stepNum ? 'step' : undefined}
              >
                <span
                  style={{
                    minWidth: 28,
                    minHeight: 28,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderColor:
                      allStepsReached || maxStepReached > stepNum
                        ? palette.accent
                        : palette.border,
                    background:
                      currentStep >= stepNum ? palette.accent : palette.border,
                    color:
                      currentStep >= stepNum
                        ? palette.textContrast
                        : allStepsReached || maxStepReached > stepNum
                          ? palette.accent
                          : palette.subtext,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    marginRight: 10,
                    fontSize: 16,
                    boxSizing: 'border-box',
                    transition: 'background 0.2s',
                  }}
                  aria-hidden="true"
                >
                  {allStepsReached || maxStepReached > stepNum ? '✓' : stepNum}
                </span>
                <span
                  style={{ fontWeight: currentStep === stepNum ? 700 : 400 }}
                >
                  {t(key as keyof typeof t)}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
};

export default StepByStepToc;
