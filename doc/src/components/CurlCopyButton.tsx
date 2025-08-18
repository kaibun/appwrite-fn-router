import { useState } from 'react';

type CurlCopyButtonProps = {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  palette: any;
};

export function CurlCopyButton(props: CurlCopyButtonProps) {
  const { method, url, headers, body, palette } = props;
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  // Generates the cURL command based on method, headers, and body.
  let curl = `curl -X ${method.toUpperCase()} `;
  Object.entries(headers).forEach(([k, v]) => {
    curl += `-H ${JSON.stringify(k + ': ' + v)} `;
  });
  if (body && method !== 'GET') {
    curl += `--data-raw ${JSON.stringify(body)} `;
  }
  curl += JSON.stringify(url);
  // Copies the generated cURL command to the clipboard.
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(curl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  // Accessibility: show/hide tooltip on keyboard focus/blur.
  const show = () => setShowTooltip(true);
  const hide = () => setShowTooltip(false);
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={copy}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={{
          marginTop: 18,
          background: palette.inputBg,
          color: copied ? palette.accent2 : palette.accent,
          border: `1px solid ${palette.inputBorder}`,
          borderRadius: 6,
          fontSize: 13,
          padding: '6px 14px',
          cursor: 'pointer',
          fontWeight: 600,
          boxShadow: '0 1px 4px #3b82f655',
          transition: 'color 0.2s',
        }}
        aria-label="Copier la requête cURL équivalente"
        title="Copier la requête cURL équivalente"
      >
        {copied ? '✅ cURL copié !' : 'Copier cURL'}
      </button>
      {showTooltip && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            bottom: '110%',
            transform: 'translateX(-50%)',
            background: palette.inputBg,
            color: palette.text,
            border: `1px solid ${palette.inputBorder}`,
            borderRadius: 8,
            boxShadow: '0 2px 12px #0002',
            padding: '10px 14px',
            zIndex: 100,
            minWidth: 320,
            maxWidth: 680,
            fontSize: 13,
            whiteSpace: 'pre-line',
            wordBreak: 'break-all',
          }}
          role="tooltip"
          tabIndex={-1}
        >
          <div
            style={{ marginBottom: 6, fontWeight: 600, color: palette.accent }}
          >
            Aperçu de la commande cURL
          </div>
          <pre
            style={{
              margin: 0,
              background: 'none',
              color: palette.text,
              fontFamily: 'monospace',
              fontSize: 13,
              padding: 0,
              userSelect: 'all',
              outline: 'none',
              border: 'none',
              whiteSpace: 'pre-wrap',
            }}
            tabIndex={0}
            aria-label="Commande cURL générée"
          >
            {curl}
          </pre>
        </div>
      )}
    </span>
  );
}
