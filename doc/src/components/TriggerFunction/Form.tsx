import React, { useRef, useEffect } from 'react';

import type { Param } from './Types';
import Body from './Form/Body';
import CustomHeaders from './Form/CustomHeaders';
import EditableURL from './Form/EditableURL';
import { usePalette } from '@src/components/PaletteProvider';
import { useI18n } from '../I18nProvider';
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
  const palette = usePalette();
  const ctx = useTriggerFunctionContext();
  const { method, computedUrl, effectiveHeaders, label } = ctx;
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
          urlTemplate={ctx.computedUrl}
          params={params}
          setParams={setParams}
          method={ctx.method}
        />
        <CurlCopyButton
          method={ctx.method}
          url={ctx.computedUrl}
          headers={ctx.effectiveHeaders}
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
          method={ctx.method}
        />
        <CustomHeaders headersOpen={headersOpen} />
        {/* <Params paramNames={paramNames} params={params} setParams={setParams} /> */}
        {/* Send button */}
        <button
          onClick={onSend}
          disabled={loading}
          style={{
            marginBottom: 8,
            marginTop: 8,
            background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.accent2} 100%)`,
            color: palette.inputBg,
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 15,
            padding: '10px 32px',
            boxShadow: '0 2px 8px 0 rgba(59,130,246,0.10)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1,
            transition: 'background 0.2s, opacity 0.2s',
            outline: 'none',
          }}
          aria-busy={loading}
          aria-label={ctx.label || ctx.t.trigger}
        >
          {loading ? ctx.t.send : ctx.label || ctx.t.trigger}
        </button>
      </div>
    </>
  );
};
export default TriggerFunctionForm;
