import React, { useRef, useEffect } from 'react';

import type { Param } from './Types';
import Body from './Form/Body';
import CustomHeaders from './Form/CustomHeaders';
import EditableURL from './Form/EditableURL';
import { usePalette } from '@src/components/PaletteProvider';
import { useI18n } from '../I18nProvider';
import { scrollToWithHeaderOffset } from './scrollToWithHeaderOffset';

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
  customHeaders: { key: string; value: string }[];
  setCustomHeaders: React.Dispatch<
    React.SetStateAction<{ key: string; value: string }[]>
  >;
  useAuth: boolean;
  setUseAuth: React.Dispatch<React.SetStateAction<boolean>>;
  onSend: () => void;
  loading: boolean;
  hasNonSimpleCustomHeader?: boolean;
  effectiveHeaders: Record<string, string>;
  computedUrl: string;
  url: string;
  method: string;
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
  customHeaders,
  setCustomHeaders,
  useAuth,
  setUseAuth,
  onSend,
  loading,
  hasNonSimpleCustomHeader,
  effectiveHeaders,
  computedUrl,
  url,
  method,
  CurlCopyButton,
  label,
  bodyOpen = false,
  headersOpen = false,
  httpError,
}) => {
  const palette = usePalette();
  const t = useI18n();
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
          urlTemplate={url}
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
        <CustomHeaders
          customHeaders={customHeaders}
          setCustomHeaders={setCustomHeaders}
          hasNonSimpleCustomHeader={hasNonSimpleCustomHeader}
          effectiveHeaders={effectiveHeaders}
          headersOpen={headersOpen}
          useAuth={useAuth}
          setUseAuth={setUseAuth}
          t={t}
        />
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
          aria-label={label || t.trigger}
        >
          {loading ? t.send : label || t.trigger}
        </button>
      </div>
    </>
  );
};
export default TriggerFunctionForm;
