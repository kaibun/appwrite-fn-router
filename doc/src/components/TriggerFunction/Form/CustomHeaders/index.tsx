import { useUIContext } from '@src/theme/UIContext';
import { useTriggerFunctionContext } from '../../contexts/TriggerFunctionContext';
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
  const { customHeaders, setCustomHeaders, effectiveHeaders } =
    useTriggerFunctionContext();

  // Helper: check if Authorization header is present
  const hasAuthHeader = customHeaders.some(
    (h) => h.key.toLowerCase() === 'authorization'
  );

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
      <PanelGroup
        direction="horizontal"
        style={{
          width: '100%',
          minHeight: 120,
          paddingTop: 4,
          marginBottom: 16,
        }}
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
          <CustomHeadersList />
          <CustomHeadersAddButton />
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
          <CustomHeadersSent />
        </Panel>
      </PanelGroup>
      <div style={{ marginTop: 4 }}>
        <CustomHeadersWarning />
      </div>
    </details>
  );
};

export default CustomHeaders;
