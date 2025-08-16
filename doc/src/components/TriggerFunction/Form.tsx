// Formulaire d’envoi (body, headers, params, bouton)
import React from 'react';

import type { Param } from './Types';

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
  palette: any;
  t: Record<string, string>;
  effectiveHeaders: Record<string, string>;
  computedUrl: string;
  method: string;
  CurlCopyButton: React.ComponentType<any>;
  label?: string;
  headersOpen?: boolean;
  bodyOpen?: boolean;
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
  palette,
  t,
  effectiveHeaders,
  computedUrl,
  method,
  CurlCopyButton,
  label,
  bodyOpen = false,
  headersOpen = false,
}) => {
  return (
    <>
      <h4
        style={{
          padding: '16px',
          background: palette.sectionBg,
          color: palette.inputBg,
        }}
      >
        {method} {computedUrl}
      </h4>
      <div
        style={{
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
          padding: '12px 16px',
        }}
      >
        {/* Custom headers */}
        <details open={headersOpen} style={{ marginBottom: 8 }}>
          <summary
            style={{
              cursor: 'pointer',
              fontSize: 13,
              marginBottom: 2,
              color: palette.subtext,
            }}
          >
            {t.customHeaders}
            {/* {readOnlyBody ? '' : t.bodyEditable} */}
          </summary>
          {/* Auth toggle */}
          <div style={{ marginBottom: 12 }}>
            <label
              htmlFor="auth-toggle"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              <input
                id="auth-toggle"
                type="checkbox"
                checked={useAuth}
                onChange={() => setUseAuth((v) => !v)}
                style={{ marginRight: 4 }}
                aria-checked={useAuth}
                aria-label={t.addAuth + t.authValue}
              />
              {t.addAuth}
              <code>{t.authValue}</code>
            </label>
          </div>
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {customHeaders.length === 0 && (
                <div
                  style={{
                    fontSize: 13,
                    color: palette.subtext,
                    marginBottom: 4,
                  }}
                >
                  {t.noCustomHeader}
                </div>
              )}
              {customHeaders.map((h, idx) => {
                const keyId = `custom-header-key-${idx}`;
                const valueId = `custom-header-value-${idx}`;
                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      background: palette.inputBg,
                      borderRadius: 6,
                      border: `1.5px solid ${palette.inputBorder}`,
                      position: 'relative',
                      padding: '2px 0',
                      marginBottom: 2,
                    }}
                  >
                    <input
                      id={keyId}
                      type="text"
                      placeholder={t.key}
                      value={h.key}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCustomHeaders((chs) =>
                          chs.map((c, i) => (i === idx ? { ...c, key: v } : c))
                        );
                      }}
                      style={{
                        width: 120,
                        marginRight: 6,
                        fontSize: 13,
                        fontWeight: 400,
                        color: palette.inputText,
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        padding: '4px 8px',
                      }}
                      aria-label={`${t.key} ${idx + 1}`}
                    />
                    <span style={{ margin: '0 4px', color: palette.subtext }}>
                      :
                    </span>
                    <input
                      id={valueId}
                      type="text"
                      placeholder={t.value}
                      value={h.value}
                      onChange={(e) => {
                        const v = e.target.value;
                        setCustomHeaders((chs) =>
                          chs.map((c, i) =>
                            i === idx ? { ...c, value: v } : c
                          )
                        );
                      }}
                      style={{
                        width: 180,
                        marginRight: 6,
                        fontSize: 13,
                        fontWeight: 400,
                        color: palette.inputText,
                        background: 'none',
                        border: 'none',
                        outline: 'none',
                        padding: '4px 8px',
                      }}
                      aria-label={`${t.value} ${idx + 1}`}
                    />
                    <button
                      type="button"
                      aria-label={t.removeHeader + ` ${idx + 1}`}
                      onClick={() =>
                        setCustomHeaders((chs) =>
                          chs.filter((_, i) => i !== idx)
                        )
                      }
                      style={{
                        fontSize: 13,
                        color: palette.errorText,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '2px 6px',
                      }}
                      title={t.removeHeader}
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
              <button
                type="button"
                onClick={() =>
                  setCustomHeaders((chs) => [...chs, { key: '', value: '' }])
                }
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  background: palette.inputBg,
                  border: `1px solid ${palette.inputBorder}`,
                  borderRadius: 6,
                  padding: '2px 12px',
                  cursor: 'pointer',
                  color: palette.accent,
                  fontWeight: 600,
                }}
              >
                {t.addHeader}
              </button>
              {hasNonSimpleCustomHeader && (
                <div
                  style={{
                    fontSize: 12,
                    color: palette.errorText,
                    marginTop: 8,
                    maxWidth: 480,
                  }}
                >
                  {t.customHeaderWarning}
                  <br />
                  {t.seeDoc}&nbsp;
                  <a
                    href="https://developer.mozilla.org/fr/docs/Web/HTTP/CORS#acc%C3%A9der_ressources_avec_credentiels"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: palette.accent2 }}
                  >
                    {t.mdnCors}
                  </a>
                  .
                </div>
              )}
            </div>
          </div>
        </details>
        {paramNames.length > 0 && (
          <fieldset style={{ margin: '8px 0 18px 0', border: 0, padding: 0 }}>
            <legend
              style={{ fontSize: 13, marginBottom: 4, color: palette.subtext }}
            >
              {t.params}
            </legend>
            <div style={{ display: 'flex', gap: 16 }}>
              {paramNames.map((name: string, idx: number) => {
                const inputId = `param-${name}-${idx}`;
                return (
                  <label
                    key={name}
                    htmlFor={inputId}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      position: 'relative',
                      minWidth: 120,
                    }}
                  >
                    <span style={{ fontSize: 13, marginRight: 4 }}>
                      {name}:
                    </span>
                    <input
                      id={inputId}
                      type="text"
                      value={
                        params.find((p: Param) => p.name === name)?.value || ''
                      }
                      onChange={(e) =>
                        setParams((ps: Param[]) =>
                          ps.map((p: Param) =>
                            p.name === name
                              ? { ...p, value: e.target.value }
                              : p
                          )
                        )
                      }
                      style={{
                        marginLeft: 0,
                        width: 120,
                        background: palette.inputBg,
                        border: `1.5px solid ${palette.inputBorder}`,
                        borderRadius: 6,
                        fontWeight: 400,
                        color: palette.inputText,
                        fontSize: 14,
                        padding: '4px 8px',
                        transition: 'background 0.2s, border 0.2s',
                      }}
                      aria-label={name}
                    />
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
        {/* Body */}
        <details open={bodyOpen} style={{ marginBottom: 8 }}>
          <summary
            style={{
              cursor: 'pointer',
              fontSize: 13,
              marginBottom: 2,
              color: palette.subtext,
            }}
          >
            {t.body}
            {readOnlyBody ? '' : t.bodyEditable}
          </summary>
          {readOnlyBody ? (
            <pre
              style={{
                background: isBodySynced ? '#e0f7fa' : palette.inputBg,
                fontFamily: 'monospace',
                fontSize: 14,
                borderRadius: 6,
                border: isBodySynced
                  ? '2px solid #00bcd4'
                  : `1.5px solid ${palette.inputBorder}`,
                padding: 8,
                marginTop: 4,
                color: palette.inputText,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                position: 'relative',
              }}
            >
              <code>{body}</code>
              {isBodySynced && (
                <span
                  style={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    background: '#00bcd4',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '2px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    boxShadow: '0 1px 4px #00bcd455',
                    letterSpacing: 0.5,
                  }}
                  title="Body synchronisé avec la dernière création"
                >
                  SYNC
                </span>
              )}
            </pre>
          ) : (
            <div style={{ position: 'relative' }}>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                style={{
                  width: '100%',
                  fontFamily: 'monospace',
                  fontSize: 14,
                  borderRadius: 6,
                  border: isBodySynced
                    ? '2px solid #00bcd4'
                    : `1.5px solid ${palette.inputBorder}`,
                  background: isBodySynced ? '#e0f7fa' : palette.inputBg,
                  padding: 8,
                  marginTop: 4,
                  color: palette.inputText,
                  fontWeight: isBodySynced ? 600 : 400,
                  transition: 'background 0.2s, border 0.2s',
                }}
              />
              {isBodySynced && (
                <span
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: 10,
                    background: '#00bcd4',
                    color: '#fff',
                    borderRadius: 12,
                    padding: '2px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    boxShadow: '0 1px 4px #00bcd455',
                    letterSpacing: 0.5,
                  }}
                  title="Body synchronisé avec la dernière création"
                >
                  SYNC
                </span>
              )}
            </div>
          )}
        </details>
        {bodyJsonError && (
          <div
            style={{ color: palette.errorText, fontSize: 13, marginTop: 4 }}
            role="alert"
          >
            ⚠️ {bodyJsonError}
          </div>
        )}
        {/* Headers envoyés + bouton cURL */}
        <div
          style={{
            marginBottom: 8,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                marginBottom: 2,
                color: palette.subtext,
              }}
            >
              {t.sentHeaders}
            </label>
            <pre
              style={{
                background: palette.inputBg,
                padding: 8,
                borderRadius: 6,
                fontSize: 13,
                margin: 0,
                overflowX: 'auto',
                color: palette.inputText,
              }}
            >
              {JSON.stringify(effectiveHeaders, null, 2)}
            </pre>
          </div>
          <CurlCopyButton
            method={method}
            url={computedUrl}
            headers={effectiveHeaders}
            body={body}
            palette={palette}
          />
        </div>
        {/* Bouton d’envoi */}
        <button
          onClick={onSend}
          disabled={loading}
          style={{
            marginBottom: 8,
            marginTop: 8,
            background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.accent2} 100%)`,
            color: '#fff',
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
          {loading ? t.send || label || t.trigger : label || t.trigger}
        </button>
      </div>
    </>
  );
};
export default TriggerFunctionForm;
