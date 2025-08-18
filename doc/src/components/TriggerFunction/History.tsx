import { useUIContext } from '@src/theme/UIContext';

interface TriggerFunctionHistoryProps {
  history: { req: any; res: any }[];
}

const TriggerFunctionHistory: React.FC<TriggerFunctionHistoryProps> = ({
  history,
}) => {
  const { palette, t } = useUIContext();

  return (
    <details style={{ padding: '18px 24px', background: palette.border }}>
      <summary
        style={{
          cursor: 'pointer',
          fontSize: 13,
          marginBottom: 2,
          color: palette.subtext,
        }}
      >
        {t.history}
      </summary>
      <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0' }}>
        {history.map((item, idx) => (
          <li
            key={idx}
            style={{
              borderBottom: `1px solid ${palette.inputBg}`,
              paddingBottom: '16px',
            }}
          >
            <div style={{ fontSize: 13, color: palette.subtext }}>
              <b>{item.req.method}</b> {item.req.url}
            </div>
            {item.req.body && (
              <pre
                style={{
                  background: palette.inputBg,
                  color: palette.inputText,
                  // padding: 6,
                  margin: '4px 0 0 0',
                  borderRadius: 6,
                  fontSize: 12,
                }}
              >
                {typeof item.req.body === 'object'
                  ? JSON.stringify(item.req.body, null, 2)
                  : String(item.req.body)}
              </pre>
            )}
            <div style={{ fontSize: 13, marginTop: 4, color: palette.subtext }}>
              <b>{t.response}</b>
            </div>
            {item.res && (
              <pre
                style={{
                  background: palette.inputBg,
                  color: palette.inputText,
                  // padding: 6,
                  margin: '4px 0 0 0',
                  borderRadius: 6,
                  fontSize: 12,
                }}
              >
                {typeof item.res === 'object'
                  ? JSON.stringify(item.res, null, 2)
                  : String(item.res)}
              </pre>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
};

export default TriggerFunctionHistory;
