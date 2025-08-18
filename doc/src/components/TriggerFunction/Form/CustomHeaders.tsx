import { useState } from 'react';

import { useUIContext } from '@site/src/theme/UIContext';
import { useHeaders } from '@site/src/components/TriggerFunction/contexts/HeadersContext';
type Header = { key: string; value: string };

export interface CustomHeadersProps {
  headersOpen: boolean;
}

const CustomHeaders: React.FC<CustomHeadersProps> = ({ headersOpen }) => {
  const { palette, t } = useUIContext();
  const {
    headers: customHeaders,
    setHeaders: setCustomHeaders,
    hasNonSimpleCustomHeader,
    effectiveHeaders,
    useAuth,
    setUseAuth,
  } = useHeaders();
  return (
    <details
      open={headersOpen}
      style={{
        marginBottom: 8,
        borderBottom: `1px dotted ${palette.border}`,
      }}
    >
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUseAuth(e.target.checked)
            }
            style={{ marginRight: 4 }}
            aria-checked={useAuth}
            aria-label={t.addAuth + t.authValue}
          />
          {t.addAuth}
          <code>{t.authValue}</code>
        </label>
      </div>
      <div style={{ marginBottom: 18 }}>
        <div>
          {customHeaders.map(
            (h: { key: string; value: string }, idx: number) => {
              const keyId = `custom-header-key-${idx}`;
              const valueId = `custom-header-value-${idx}`;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 24px 1fr 24px',
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
                      setCustomHeaders(
                        customHeaders.map((c, i) =>
                          i === idx ? { ...c, key: v } : c
                        )
                      );
                    }}
                    style={{
                      minWidth: 0,
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
                  <span
                    style={{
                      margin: '0 4px',
                      color: palette.subtext,
                      width: 'fit-content',
                    }}
                  >
                    :
                  </span>
                  <input
                    id={valueId}
                    type="text"
                    placeholder={t.value}
                    value={h.value}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCustomHeaders(
                        customHeaders.map((c, i) =>
                          i === idx ? { ...c, value: v } : c
                        )
                      );
                    }}
                    style={{
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
                      setCustomHeaders(
                        customHeaders.filter((_, i) => i !== idx)
                      )
                    }
                    style={{
                      fontSize: 13,
                      color: palette.errorText,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px 6px',
                      width: 'fit-content',
                    }}
                    title={t.removeHeader}
                  >
                    ✕
                  </button>
                </div>
              );
            }
          )}

          {(() => {
            const [hover, setHover] = useState(false);
            return (
              <button
                type="button"
                onClick={() =>
                  setCustomHeaders([...customHeaders, { key: '', value: '' }])
                }
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                style={{
                  fontSize: 13,
                  marginTop: 2,
                  background: palette.inputBg,
                  border: `1px solid ${hover ? palette.accent : palette.inputBorder}`,
                  borderRadius: 6,
                  padding: '2px 12px',
                  cursor: 'pointer',
                  color: palette.accent,
                  fontWeight: 600,
                }}
              >
                {t.addHeader}
              </button>
            );
          })()}
          {hasNonSimpleCustomHeader && (
            <div
              style={{
                fontSize: 12,
                color: palette.errorText,
                marginTop: 8,
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
        </div>
      </div>
    </details>
  );
};

export default CustomHeaders;
