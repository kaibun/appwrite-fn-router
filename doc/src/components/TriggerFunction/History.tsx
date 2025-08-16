import React from 'react';

interface TriggerFunctionHistoryProps {
  history: { req: any; res: any }[];
  palette: any;
  t: Record<string, string>;
}

const TriggerFunctionHistory: React.FC<TriggerFunctionHistoryProps> = ({
  history,
  palette,
  t,
}) => {
  return (
    <div style={{ padding: '18px 24px', background: 'none' }}>
      <h4>{t.history}</h4>
      <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0' }}>
        {history.map((item, idx) => (
          <li
            key={idx}
            style={{
              marginBottom: 12,
              borderBottom: `1px solid ${palette.border}`,
              paddingBottom: 8,
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
                  padding: 6,
                  borderRadius: 6,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {typeof item.req.body === 'object'
                  ? JSON.stringify(item.req.body, null, 2)
                  : String(item.req.body)}
              </pre>
            )}
            <div style={{ fontSize: 13, marginTop: 4 }}>
              <b>{t.response}</b>
              <pre
                style={{
                  background: palette.inputBg,
                  color: palette.inputText,
                  padding: 6,
                  borderRadius: 6,
                  fontSize: 12,
                  marginTop: 2,
                }}
              >
                {typeof item.res === 'object'
                  ? JSON.stringify(item.res, null, 2)
                  : String(item.res)}
              </pre>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TriggerFunctionHistory;
