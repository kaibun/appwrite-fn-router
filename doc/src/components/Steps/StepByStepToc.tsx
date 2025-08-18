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

  return (
    <aside
      style={{
        position: 'fixed',
        top: 100,
        right: 32,
        width: 320,
        background: palette.inputBg,
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        boxShadow:
          colorMode === 'dark'
            ? '0 4px 16px 0 rgba(0,0,0,0.4)'
            : '0 4px 16px 0 rgba(60, 80, 120, 0.07)',
        padding: '24px 24px 16px 24px',
        zIndex: 100,
        maxHeight: '80vh',
        overflowY: 'auto',
        color: palette.text,
      }}
      aria-label={t.stepByStepSummary}
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
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
      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {stepKeys.map((key, idx) => {
          const stepNum = idx + 1;
          const unlocked = stepByStep ? maxStepReached >= stepNum : true;
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
                  const el = document.getElementById(`step-anchor-${stepNum}`);
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
                    maxStepReached > stepNum ? palette.accent : palette.border,
                  background:
                    currentStep >= stepNum ? palette.accent : palette.border,
                  color:
                    currentStep >= stepNum
                      ? palette.textContrast
                      : maxStepReached > stepNum
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
                {maxStepReached > stepNum ? '✓' : stepNum}
              </span>
              <span style={{ fontWeight: currentStep === stepNum ? 700 : 400 }}>
                {t(key as keyof typeof t)}
              </span>
            </li>
          );
        })}
      </ol>
    </aside>
  );
};

export default StepByStepToc;
