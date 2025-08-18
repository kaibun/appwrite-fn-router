import { useUIContext } from '@src/theme/UIContext';

export interface BodyProps {
  bodyOpen: boolean;
  body: string;
  setBody: React.Dispatch<React.SetStateAction<string>>;
  bodyJsonError: string | null;
  readOnlyBody?: boolean;
  isBodySynced?: boolean;
  method: string; // Ajouté pour recevoir la méthode de la requête
}

const Body: React.FC<BodyProps> = ({
  bodyOpen,
  readOnlyBody,
  isBodySynced,
  body,
  setBody,
  bodyJsonError,
  method,
}) => {
  if (method === 'GET') return null;
  const { palette, t } = useUIContext();

  return (
    <>
      <details
        open={bodyOpen}
        style={{
          marginBottom: 8,
          borderBottom: `1px dotted ${palette.border}`,
        }}
      >
        <summary
          style={{
            cursor: 'pointer',
            fontSize: 13,
            marginBottom: 2,
            color: palette.subtext,
          }}
        >
          {t.body}
          {readOnlyBody ? '' : t.bodyEditable}
        </summary>
        {readOnlyBody ? (
          <pre
            style={{
              background: isBodySynced ? '#e0f7fa' : palette.inputBg,
              fontFamily: 'monospace',
              fontSize: 14,
              borderRadius: 6,
              border: isBodySynced
                ? '2px solid #00bcd4'
                : `1.5px solid ${palette.inputBorder}`,
              padding: 8,
              marginTop: 4,
              color: palette.inputText,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              position: 'relative',
            }}
          >
            <code>{body}</code>
            {isBodySynced && (
              <span
                style={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  background: '#00bcd4',
                  color: '#fff',
                  borderRadius: 12,
                  padding: '2px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  boxShadow: '0 1px 4px #00bcd455',
                  letterSpacing: 0.5,
                }}
                title="Body synchronisé avec la dernière création"
              >
                SYNC
              </span>
            )}
          </pre>
        ) : (
          <div style={{ position: 'relative' }}>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              style={{
                width: '100%',
                fontFamily: 'monospace',
                fontSize: 14,
                borderRadius: 6,
                border: isBodySynced
                  ? '2px solid #00bcd4'
                  : `1.5px solid ${palette.inputBorder}`,
                background: isBodySynced ? '#e0f7fa' : palette.inputBg,
                padding: 8,
                marginTop: 4,
                color: palette.inputText,
                fontWeight: isBodySynced ? 600 : 400,
                transition: 'background 0.2s, border 0.2s',
              }}
            />
            {isBodySynced && (
              <span
                style={{
                  position: 'absolute',
                  right: 12,
                  top: 10,
                  background: '#00bcd4',
                  color: '#fff',
                  borderRadius: 12,
                  padding: '2px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  boxShadow: '0 1px 4px #00bcd455',
                  letterSpacing: 0.5,
                }}
                title="Body synchronisé avec la dernière création"
              >
                SYNC
              </span>
            )}
          </div>
        )}
      </details>
      {bodyJsonError && (
        <div
          style={{ color: palette.errorText, fontSize: 13, marginTop: 4 }}
          role="alert"
        >
          ⚠️ {bodyJsonError}
        </div>
      )}
    </>
  );
};

export default Body;
