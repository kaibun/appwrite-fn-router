import React, { useEffect, useState } from 'react';
import { usePalette } from '../PaletteProvider';
import CodeBlock from '@theme/CodeBlock';
import { useI18n } from '../I18nProvider';

interface TriggerFunctionResultProps {
  response: Response;
}

const TriggerFunctionResult: React.FC<TriggerFunctionResultProps> = ({
  response,
}) => {
  const palette = usePalette();
  const t = useI18n();
  const [body, setBody] = useState<string>('');
  const [headers, setHeaders] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    response.text().then((text) => {
      if (isMounted) setBody(text);
    });
    const headersObj: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      headersObj[key] = value;
    });
    setHeaders(headersObj);
    return () => {
      isMounted = false;
    };
  }, [response]);

  return (
    <div
      style={{
        padding: '18px 24px',
        background:
          response.status >= 400 ? palette.resultErrorBg : palette.resultBg,
      }}
    >
      <div style={{ fontSize: 13, color: palette.text, marginBottom: 4 }}>
        HTTP {response.status} {response.statusText}
      </div>
      <div style={{ marginBottom: 8 }}>
        <CodeBlock language="json" title={t.response}>
          {body || ''}
        </CodeBlock>
      </div>
      <div style={{ marginBottom: 8 }}>
        <CodeBlock language="json" title={t.responseHeaders}>
          {JSON.stringify(headers, null, 2)}
        </CodeBlock>
      </div>
    </div>
  );
};

export default TriggerFunctionResult;
