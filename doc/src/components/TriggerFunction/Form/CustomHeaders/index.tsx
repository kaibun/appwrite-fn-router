import { useUIContext } from '@src/theme/UIContext';
import { useTriggerFunctionContext } from '../../Context';
import CustomHeadersList from './CustomHeadersList';
import CustomHeadersAddButton from './CustomHeadersAddButton';
import CustomHeadersWarning from './CustomHeadersWarning';
import CustomHeadersSent from './CustomHeadersSent';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';

export interface CustomHeadersProps {
  headersOpen: boolean;
}

const CustomHeaders: React.FC<CustomHeadersProps> = ({ headersOpen }) => {
  const { palette, t } = useUIContext();
  const {
    customHeaders,
    setCustomHeaders,
    effectiveHeaders,
    useAuth,
    setUseAuth,
  } = useTriggerFunctionContext();
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
      <PanelGroup
        direction="horizontal"
        style={{ width: '100%', minHeight: 120, marginBottom: 18 }}
      >
        <Panel minSize={20} defaultSize={50} style={{ paddingRight: 12 }}>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              marginBottom: 2,
              color: palette.textContrast,
              fontWeight: 'bold',
              background: palette.accent,
              padding: '4px 8px',
              borderRadius: 6,
            }}
          >
            {t.buildHeaders}
          </label>
          <CustomHeadersList
            customHeaders={customHeaders}
            setCustomHeaders={setCustomHeaders}
            t={t}
            palette={palette}
          />
          <CustomHeadersAddButton
            setCustomHeaders={setCustomHeaders}
            t={t}
            palette={palette}
          />
        </Panel>
        <PanelResizeHandle
          style={{ width: 6, background: palette.border, cursor: 'col-resize' }}
        />
        <Panel minSize={20} defaultSize={50} style={{ paddingLeft: 12 }}>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              marginBottom: 2,
              color: palette.subtext,
              fontWeight: 'bold',
              background: palette.border,
              padding: '4px 8px',
              borderRadius: 6,
            }}
          >
            {t.sentHeaders}
          </label>
          <CustomHeadersSent
            effectiveHeaders={effectiveHeaders}
            t={t}
            palette={palette}
          />
        </Panel>
      </PanelGroup>
      <div style={{ marginTop: 4 }}>
        <CustomHeadersWarning />
      </div>
    </details>
  );
};

export default CustomHeaders;
