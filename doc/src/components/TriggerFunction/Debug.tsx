import { useUIContext } from '@src/theme/UIContext';

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
  const { palette, t } = useUIContext();

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
          {t('debugPropUrl')} <code>url</code> :{' '}
          <code>{String(rawUrlProp)}</code>
        </span>
        <br />
        <span>
          {t('debugUsedUrl')}: <code>{computedUrl}</code>
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
