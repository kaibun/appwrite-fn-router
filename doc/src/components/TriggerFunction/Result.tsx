import React from 'react';

interface TriggerFunctionResultProps {
  response: string | null;
  httpError: { status: number; statusText: string; body?: string } | null;
  responseTime: number | null;
  responseHeaders: Record<string, string> | null;
  palette: any;
  t: Record<string, string>;
}

const TriggerFunctionResult: React.FC<TriggerFunctionResultProps> = ({
  response,
  httpError,
  responseTime,
  responseHeaders,
  palette,
  t,
}) => {
  return (
    <div style={{ padding: '18px 24px', background: 'none' }}>
      {/* Temps de réponse */}
      {responseTime !== null && (
        <div style={{ fontSize: 13, color: palette.subtext, marginBottom: 4 }}>
          ⏱ {responseTime} ms
        </div>
      )}
      {/* Erreur HTTP */}
      {httpError && (
        <div
          style={{ color: palette.errorText, fontSize: 14, marginBottom: 8 }}
          role="alert"
        >
          <strong>{t.httpError}</strong> {httpError.status}{' '}
          {httpError.statusText}
          {httpError.body && (
            <pre
              style={{
                background: palette.errorBg,
                color: palette.errorText,
                padding: 8,
                borderRadius: 6,
                marginTop: 4,
                fontSize: 13,
              }}
            >
              <b>{t.httpErrorBody}</b>
              <br />
              {httpError.body}
            </pre>
          )}
        </div>
      )}
      {/* Réponse */}
      {response && !httpError && (
        <div style={{ marginBottom: 8 }}>
          <strong>{t.response}</strong>
          <pre
            style={{
              background: palette.inputBg,
              color: palette.inputText,
              padding: 8,
              borderRadius: 6,
              marginTop: 4,
              fontSize: 13,
            }}
          >
            {response}
          </pre>
        </div>
      )}
      {/* Headers de la réponse HTTP */}
      {responseHeaders && (
        <div style={{ marginBottom: 8 }}>
          <strong>{t.responseHeaders}</strong>
          <pre
            style={{
              background: palette.inputBg,
              color: palette.inputText,
              padding: 8,
              borderRadius: 6,
              marginTop: 4,
              fontSize: 13,
            }}
          >
            {JSON.stringify(responseHeaders, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TriggerFunctionResult;
