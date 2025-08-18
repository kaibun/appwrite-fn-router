import { useHeaders } from '../../contexts/HeadersContext';
import { predefinedHeaders } from '../../config';
import { useUIContext } from '@src/theme/UIContext';
import { useTriggerFunctionContext } from '../../contexts/TriggerFunctionContext';

const CustomHeadersList = () => {
  const { customHeaders, setCustomHeaders } = useTriggerFunctionContext();
  const { palette, t } = useUIContext();
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 24px 1fr 24px 24px 24px',
          alignItems: 'center',
          fontWeight: 600,
          fontSize: '0.75em',
        }}
      >
        <span>Key</span>
        <span></span>
        <span>Value</span>
        <span
          style={{
            color: '#2ecc40',
            fontWeight: 700,
            fontSize: '1.2em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
          aria-label="Enabled header"
          title="Enabled header: this header will be sent"
        >
          ✓
        </span>
        <span
          style={{
            color: '#2986ff',
            fontWeight: 700,
            fontSize: '1.2em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
          aria-label="CORS-enabled header"
          title="CORS-enabled: this header is marked for CORS"
        >
          C
        </span>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
          }}
          aria-label="Remove this header"
          title="Remove this header"
        >
          🗑️
        </span>
        <span></span>
      </div>
      {customHeaders.map((h: any, idx: number) => {
        const keyId = `custom-header-key-${idx + 1}`;
        const valueId = `custom-header-value-${idx + 1}`;
        const enabledId = `custom-header-enabled-${idx + 1}`;
        const corsId = `custom-header-cors-${idx + 1}`;
        return (
          <div
            key={keyId}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 24px 1fr 24px 24px 24px',
              background: palette.inputBg,
              borderRadius: 6,
              border: `1.5px solid ${palette.inputBorder}`,
              position: 'relative',
              padding: '2px 0',
              marginBottom: 2,
              alignItems: 'center',
            }}
          >
            <input
              id={keyId}
              type="text"
              placeholder={t.key}
              value={h.key}
              readOnly={!h.dynamic}
              onChange={(e) => {
                const v = e.target.value;
                setCustomHeaders((chs: any) =>
                  chs.map((c: any, i: number) =>
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
                background: h.dynamic ? palette.inputBgEditable : 'transparent',
                border: 'none',
                outline: 'none',
                padding: '4px 8px',
              }}
              aria-label={`${t.key} ${idx + 2}`}
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
                setCustomHeaders((chs: any) =>
                  chs.map((c: any, i: number) =>
                    i === idx ? { ...c, value: v } : c
                  )
                );
              }}
              style={{
                marginRight: 6,
                fontSize: 13,
                fontWeight: 400,
                color: palette.inputText,
                background: palette.inputBgEditable,
                border: 'none',
                outline: 'none',
                padding: '4px 8px',
              }}
              aria-label={`${t.value} ${idx + 2}`}
            />
            <input
              id={enabledId}
              type="checkbox"
              checked={h.tainted ? h.enabled : h.key && h.value ? true : false}
              onChange={() =>
                setCustomHeaders((chs: any) =>
                  chs.map((c: any, i: number) =>
                    i === idx
                      ? {
                          ...c,
                          enabled: !(c.tainted ? c.enabled : c.key && c.value),
                          tainted: true,
                        }
                      : c
                  )
                )
              }
              style={{ textAlign: 'center' }}
              aria-label={h.enabled ? 'Enabled' : 'Disabled'}
              title={h.enabled ? 'Enabled' : 'Disabled'}
            />
            {/* CORS-enabled checkbox for custom header */}
            <input
              id={corsId}
              type="checkbox"
              checked={h.corsEnabled ?? false}
              onChange={() =>
                setCustomHeaders((chs: any) =>
                  chs.map((c: any, i: number) =>
                    i === idx ? { ...c, corsEnabled: !c.corsEnabled } : c
                  )
                )
              }
              style={{
                textAlign: 'center',
              }}
              aria-label={h.corsEnabled ? 'CORS-enabled' : 'CORS-disabled'}
              title={h.corsEnabled ? 'CORS-enabled' : 'CORS-disabled'}
            />
            {h.dynamic && (
              <button
                type="button"
                aria-label={t.removeHeader + ` ${idx + 2}`}
                onClick={() =>
                  setCustomHeaders((chs: any) =>
                    chs.filter((_: any, i: number) => i !== idx)
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
            )}
          </div>
        );
      })}
    </>
  );
};

export default CustomHeadersList;
