import React, { useState } from 'react';

interface TriggerFunctionProps {
  method: string;
  url: string;
  body?: any;
  headers?: Record<string, string>;
  label?: string;
}

const defaultHeaders = { 'Content-Type': 'application/json' };

export default function TriggerFunction({
  method,
  url,
  body,
  headers = {},
  label = 'Trigger Function',
}: TriggerFunctionProps) {
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    try {
      const res = await fetch(url, {
        method,
        headers: { ...defaultHeaders, ...headers },
        body: body ? JSON.stringify(body) : undefined,
      });
      const contentType = res.headers.get('content-type') || '';
      let text = await res.text();
      if (contentType.includes('application/json')) {
        try {
          text = JSON.stringify(JSON.parse(text), null, 2);
        } catch {}
      }
      setResponse(text);
    } catch (e: any) {
      setResponse('Erreur: ' + (e?.message || e));
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        margin: '1em 0',
        border: '1px solid #eee',
        borderRadius: 6,
        padding: 12,
      }}
    >
      <pre style={{ background: '#f6f8fa', padding: 8, borderRadius: 4 }}>
        <code>
          {method} {url}
          {body ? '\n' + JSON.stringify(body, null, 2) : ''}
        </code>
      </pre>
      <button
        onClick={sendRequest}
        disabled={loading}
        style={{ marginBottom: 8 }}
      >
        {loading ? 'Envoi...' : label}
      </button>
      {response && (
        <pre
          style={{
            background: '#f6f8fa',
            marginTop: 8,
            padding: 8,
            borderRadius: 4,
          }}
        >
          <code>{response}</code>
        </pre>
      )}
    </div>
  );
}
