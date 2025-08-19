import { useEffect, useState } from 'react';

import { useUIContext } from '@src/theme/UIContext';
import CodeBlock from '@theme/CodeBlock';

interface TriggerFunctionResultProps {
  response: Response;
}

const TriggerFunctionResult: React.FC<TriggerFunctionResultProps> = ({
  response,
}) => {
  const { palette, t } = useUIContext();
  const [body, setBody] = useState<string>('');
  const [headers, setHeaders] = useState<Record<string, string>>({});

  useEffect(() => {
    let isMounted = true;
    response.text().then((text) => {
      if (isMounted) {
        try {
          const json = JSON.parse(text);
          setBody(JSON.stringify(json, null, 2));
        } catch (e) {
          setBody(text);
        }
      }
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

  // Détermine le gradient selon le code HTTP
  const gradient =
    response.status >= 400
      ? 'linear-gradient(0deg, #ff7b7b 0%, #ff7b7b 20%, #181818 100%)'
      : 'linear-gradient(0deg, #57d99c 0%, #57d99c 20%, #181818 100%)';
  return (
    <div
      style={{
        padding: '18px 24px',
        background: gradient,
      }}
    >
      <div
        style={{
          fontSize: 13,
          color: palette.light ? palette.textContrast : palette.text,
          marginBottom: 4,
        }}
      >
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
