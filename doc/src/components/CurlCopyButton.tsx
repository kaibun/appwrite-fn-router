import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { useUIContext } from '@src/theme/UIContext';

type CurlCopyButtonProps = {
  body: string;
  headers: Record<string, string>;
  method: string;
  url: string;
};

export default function CurlCopyButton(props: CurlCopyButtonProps) {
  const buttonRef = useState<null | HTMLButtonElement>(null);
  const [tooltipPos, setTooltipPos] = useState<{
    left: number;
    top: number;
  } | null>(null);
  const { palette, t } = useUIContext();
  const { method, url, headers, body } = props;
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

  // When tooltip is shown, calculate its position
  // (useEffect triggers only when showTooltip changes)
  useEffect(() => {
    if (showTooltip && buttonRef[0]) {
      const rect = buttonRef[0].getBoundingClientRect();
      setTooltipPos({
        left: rect.left + rect.width / 2,
        top: rect.bottom + 8,
      });
    }
  }, [showTooltip]);
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-block',
        overflow: 'visible',
      }}
    >
      <button
        ref={(el) => buttonRef[1](el)}
        type="button"
        onClick={copy}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        style={{
          marginTop: 18,
          background: 'transparent',
          color: palette.textContrast,
          border: `1px dashed ${palette.inputBorder}`,
          borderRadius: 8,
          fontSize: 14,
          padding: '14px 16px',
          cursor: 'pointer',
          fontWeight: 700,
          boxShadow: '0 1px 4px #3b82f655',
          transition: 'color 0.2s',
        }}
        aria-label={t('curlCopyAria')}
        title={t('curlCopyAria')}
      >
        {copied ? t('curlCopied') : t('curlCopyButton')}
      </button>
      {showTooltip &&
        tooltipPos &&
        createPortal(
          <div
            style={{
              position: 'fixed',
              left: tooltipPos.left,
              top: tooltipPos.top,
              transform: 'translateX(-50%)',
              background: palette.inputBg,
              color: palette.text,
              border: `1px solid ${palette.inputBorder}`,
              borderRadius: 8,
              boxShadow: '0 2px 12px #0002',
              padding: '10px 14px',
              zIndex: 99999,
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
              style={{
                marginBottom: 6,
                fontWeight: 600,
                color: palette.accent,
              }}
            >
              {t('curlPreviewTitle')}
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
              aria-label={t('curlPreviewAria')}
            >
              {curl}
            </pre>
          </div>,
          document.body
        )}
    </span>
  );
}
