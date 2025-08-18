import { useRef, useEffect } from 'react';

import { useUIContext } from '@src/theme/UIContext';
import type { Param } from './Types';
import Body from './Form/Body';
import StepNextButton from '@src/components/Steps/StepNextButton';
import CustomHeaders from './Form/CustomHeaders';
import EditableURL from './Form/EditableURL';
import { scrollToWithHeaderOffset } from './scrollToWithHeaderOffset';
import { useTriggerFunctionContext } from './Context';

interface TriggerFunctionFormProps {
  paramNames: string[];
  params: Param[];
  setParams: React.Dispatch<React.SetStateAction<Param[]>>;
  body: string;
  setBody: React.Dispatch<React.SetStateAction<string>>;
  bodyJsonError: string | null;
  readOnlyBody?: boolean;
  isBodySynced?: boolean;
  isHeadersSynced?: boolean;
  onSend: () => void;
  loading: boolean;
  CurlCopyButton: React.ComponentType<any>;
  label?: string;
  headersOpen?: boolean;
  bodyOpen?: boolean;
  httpError?: any;
}

const TriggerFunctionForm: React.FC<TriggerFunctionFormProps> = ({
  paramNames,
  params,
  setParams,
  body,
  setBody,
  bodyJsonError,
  readOnlyBody,
  isBodySynced,
  onSend,
  loading,
  CurlCopyButton,
  bodyOpen = false,
  headersOpen = true,
  httpError,
}) => {
  const { palette, t } = useUIContext();
  const { method, computedUrl, effectiveHeaders, label } =
    useTriggerFunctionContext();
  const editableUrlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (httpError && editableUrlRef.current) {
      scrollToWithHeaderOffset(editableUrlRef.current);
    }
  }, [httpError]);

  return (
    <>
      {/* Request URL + cURL button */}
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
        <EditableURL
          urlTemplate={computedUrl}
          params={params}
          setParams={setParams}
          method={method}
        />
        <CurlCopyButton
          method={method}
          url={computedUrl}
          headers={effectiveHeaders}
          body={body}
          palette={palette}
        />
      </div>
      <div
        style={{
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          padding: '12px 16px',
        }}
      >
        <Body
          bodyOpen={bodyOpen}
          readOnlyBody={readOnlyBody}
          isBodySynced={isBodySynced}
          body={body}
          setBody={setBody}
          bodyJsonError={bodyJsonError}
          method={method}
        />
        <CustomHeaders headersOpen={headersOpen} />
        {/* <Params paramNames={paramNames} params={params} setParams={setParams} /> */}
        {/* Send button */}
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
