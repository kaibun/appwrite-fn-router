import React from 'react';
import { usePalette } from '@src/components/PaletteProvider';
import { useI18n } from '@src/components/I18nProvider';

interface TriggerFunctionDebugProps {
  showDebugInfo: boolean;
  showUrlDebug: boolean;
  rawUrlProp: string;
  computedUrl: string;
  urlWarning: string | null;
  method: string;
}

const TriggerFunctionDebug: React.FC<TriggerFunctionDebugProps> = ({
  showDebugInfo,
  showUrlDebug,
  rawUrlProp,
  computedUrl,
  urlWarning,
  method,
}) => {
  if (!showDebugInfo) {
    return null;
  }
  const palette = usePalette();
  const t = useI18n();
  return (
    <div
      style={{
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6,
        padding: '20px 24px',
        background: palette.debugBg,
      }}
    >
      <div style={{ fontSize: 13, color: palette.subtext, marginBottom: 4 }}>
        <span>
          Prop <code>url</code> : <code>{String(rawUrlProp)}</code>
        </span>
        <br />
        <span>
          URL utilisée : <code>{computedUrl}</code>
        </span>
        {urlWarning && (
          <>
            <br />
            <span
              style={{ color: palette.errorText, fontWeight: 500 }}
              role="alert"
            >
              ⚠️ {urlWarning}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

export default TriggerFunctionDebug;
