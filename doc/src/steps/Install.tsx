import { useUIContext } from '@src/theme/UIContext';
import { useStepMode } from '@src/components/Steps/StepProvider';
import CodeFromFile from '@src/components/CodeFromFile';
import StepNextButton from '@src/components/Steps/StepNextButton';

export default ({ next }: { next: () => void }) => {
  const { t } = useUIContext();
  const { stepByStep } = useStepMode();

  return (
    <>
      <CodeFromFile
        file={
          require('!!raw-loader!@site/src/code-examples/install.example.ts.txt')
            .default
        }
        language="bash"
      />
      {stepByStep && (
        <StepNextButton onClick={next} stepNumber={1}>
          {t.nextStep}
        </StepNextButton>
      )}
    </>
  );
};
