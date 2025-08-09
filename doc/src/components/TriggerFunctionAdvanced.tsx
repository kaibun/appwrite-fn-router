import React, { useState } from 'react';

interface Param {
  name: string;
  value: string;
}

interface TriggerFunctionAdvancedProps {
  method: string;
  url: string;
  body?: any;
  headers?: Record<string, string>;
  label?: string;
  urlParams?: string[]; // ex: ['id'] pour /widgets/:id
  step?: number;
  onStepDone?: (response: any) => void;
}

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

function extractParams(url: string): string[] {
  // Extrait les :param dans /widgets/:id
  const matches = url.match(/:([a-zA-Z0-9_]+)/g);
  return matches ? matches.map((m) => m.slice(1)) : [];
}

const TriggerFunctionAdvanced: React.FC<TriggerFunctionAdvancedProps> = ({
  method,
  url,
  body: initialBody,
  headers = {},
  label = 'Trigger Function',
  urlParams,
  step,
  onStepDone,
}) => {
  // Gestion des paramètres dynamiques de l’URL
  const paramNames = urlParams || extractParams(url);
  const [params, setParams] = useState<Param[]>(
    paramNames.map((name) => ({ name, value: '' }))
  );
  const [body, setBody] = useState(
    initialBody ? JSON.stringify(initialBody, null, 2) : ''
  );
  const [useAuth, setUseAuth] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ req: any; res: any }[]>([]);

  // Remplace les :param dans l’URL par leur valeur
  const computedUrl = paramNames.reduce((acc, name) => {
    const val = params.find((p) => p.name === name)?.value || '';
    return acc.replace(`:${name}`, val);
  }, url);

  const sendRequest = async () => {
    setLoading(true);
    setResponse(null);
    let parsedBody: any = undefined;
    try {
      parsedBody = body ? JSON.parse(body) : undefined;
    } catch (e) {
      setResponse('Erreur : le body n’est pas un JSON valide.');
      setLoading(false);
      return;
    }
    try {
      const finalHeaders: Record<string, string> = {
        ...defaultHeaders,
        ...headers,
      };
      if (useAuth) (finalHeaders as any)['Authorization'] = 'Bearer foobar';
      const res = await fetch(computedUrl, {
        method,
        headers: finalHeaders,
        body:
          parsedBody && method !== 'GET'
            ? JSON.stringify(parsedBody)
            : undefined,
      });
      const contentType = res.headers.get('content-type') || '';
      let text = await res.text();
      if (contentType.includes('application/json')) {
        try {
          text = JSON.stringify(JSON.parse(text), null, 2);
        } catch {}
      }
      setResponse(text);
      setHistory((h) => [
        {
          req: {
            method,
            url: computedUrl,
            body: parsedBody,
            headers: finalHeaders,
          },
          res: text,
        },
        ...h.slice(0, 4),
      ]);
      if (onStepDone) onStepDone(text);
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
      <div style={{ marginBottom: 8 }}>
        <strong>{method}</strong> {computedUrl}
        {paramNames.length > 0 && (
          <div style={{ margin: '8px 0' }}>
            {paramNames.map((name) => (
              <label key={name} style={{ marginRight: 12 }}>
                <span style={{ fontSize: 13 }}>{name}:</span>
                <input
                  type="text"
                  value={params.find((p) => p.name === name)?.value || ''}
                  onChange={(e) =>
                    setParams((ps) =>
                      ps.map((p) =>
                        p.name === name ? { ...p, value: e.target.value } : p
                      )
                    )
                  }
                  style={{ marginLeft: 4, width: 120 }}
                />
              </label>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginBottom: 8 }}>
        <label>
          <input
            type="checkbox"
            checked={useAuth}
            onChange={() => setUseAuth((v) => !v)}
            style={{ marginRight: 4 }}
          />
          Ajouter le header <code>Authorization: Bearer foobar</code>
        </label>
      </div>
      {method !== 'GET' && (
        <div style={{ marginBottom: 8 }}>
          <label style={{ display: 'block', fontSize: 13, marginBottom: 2 }}>
            Body (JSON modifiable) :
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            style={{
              width: '100%',
              fontFamily: 'monospace',
              fontSize: 14,
              borderRadius: 4,
              border: '1px solid #ccc',
              padding: 6,
            }}
          />
        </div>
      )}
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
            maxHeight: 300,
            overflow: 'auto',
          }}
        >
          <code>{response}</code>
        </pre>
      )}
      {history.length > 0 && (
        <details style={{ marginTop: 12 }}>
          <summary style={{ cursor: 'pointer' }}>
            Historique (5 dernières requêtes)
          </summary>
          <ol style={{ fontSize: 13 }}>
            {history.map((h, i) => (
              <li key={i} style={{ marginBottom: 8 }}>
                <div>
                  <b>{h.req.method}</b> {h.req.url}
                </div>
                {h.req.body && (
                  <div>
                    Body: <code>{JSON.stringify(h.req.body)}</code>
                  </div>
                )}
                <div>
                  Headers: <code>{JSON.stringify(h.req.headers)}</code>
                </div>
                <div>
                  Réponse :{' '}
                  <pre style={{ display: 'inline', background: '#f6f8fa' }}>
                    {h.res}
                  </pre>
                </div>
              </li>
            ))}
          </ol>
        </details>
      )}
    </div>
  );
};

export default TriggerFunctionAdvanced;
