import { useRef, useEffect } from 'react';

import { useBody } from '../contexts/BodyContext';
import { useUIContext } from '@src/theme/UIContext';
import { useTriggerFunctionContext } from '@site/src/components/TriggerFunction/contexts/TriggerFunctionContext';
import StepNextButton from '@src/components/Steps/StepNextButton';
import { scrollToWithHeaderOffset } from '@site/src/components/TriggerFunction/utils/scrollToWithHeaderOffset';
import CurlCopyButton from '@src/components/CurlCopyButton';
import Body from './Body';
import CustomHeaders from './CustomHeaders';
import EditableURL from './EditableURL';

interface TriggerFunctionFormProps {
  onSend: () => void;
  loading: boolean;
  label?: string;
  headersOpen?: boolean;
  bodyOpen?: boolean;
  httpError?: any;
}

const TriggerFunctionForm: React.FC<TriggerFunctionFormProps> = ({
  onSend,
  loading,
  bodyOpen = false,
  headersOpen = true,
  httpError,
}) => {
  const { palette, t } = useUIContext();
  const { method, computedUrl, effectiveHeaders, label } =
    useTriggerFunctionContext();
  const editableUrlRef = useRef<HTMLDivElement>(null);
  const { body } = useBody();

  useEffect(() => {
    if (httpError && editableUrlRef.current) {
      scrollToWithHeaderOffset(editableUrlRef.current);
    }
  }, [httpError]);

  return (
    <>
      <div
        ref={editableUrlRef}
        style={{
          marginBottom: 8,
          display: 'flex',
          alignItems: 'flex-start',
          gap: 16,
          justifyContent: 'space-between',
          padding: '16px',
          background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.accent2} 100%)`,
        }}
      >
        <EditableURL />
        <CurlCopyButton
          body={body}
          headers={effectiveHeaders}
          method={method}
          url={computedUrl}
        />
      </div>
      <div
        style={{
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          padding: '12px 16px',
        }}
      >
        <Body bodyOpen={bodyOpen} />
        <CustomHeaders headersOpen={headersOpen} />
        <StepNextButton
          onClick={onSend}
          stepNumber={undefined}
          disabled={loading}
          aria-busy={loading}
          aria-label={label || t.trigger}
        >
          {loading ? t.send : label || t.trigger}
        </StepNextButton>
      </div>
    </>
  );
};
export default TriggerFunctionForm;
