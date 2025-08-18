import { useUIContext } from '@src/theme/UIContext';
import { useTriggerFunctionContext } from '../../contexts/TriggerFunctionContext';

export default function CustomHeadersSent() {
  const { customHeaders } = useTriggerFunctionContext();
  const { palette, t } = useUIContext();
  const sentHeaders = customHeaders.filter(
    (h: any) => h.enabled && h.key && h.value
  );
  return (
    <div
      style={{
        background: palette.inputBg,
        borderRadius: 6,
        border: `1.5px solid ${palette.inputBorder}`,
        padding: '8px',
        fontSize: 13,
        color: palette.inputText,
        minHeight: 60,
        whiteSpace: 'pre-wrap',
      }}
    >
      {sentHeaders.length === 0
        ? t.noHeadersSent
        : sentHeaders.map((h: any, idx: number) => (
            <div
              key={h.key + idx}
              style={{
                color:
                  h.enabled && !h.corsEnabled
                    ? palette.errorText
                    : palette.inputText,
              }}
            >
              {h.key}: {h.value}
            </div>
          ))}
    </div>
  );
}
