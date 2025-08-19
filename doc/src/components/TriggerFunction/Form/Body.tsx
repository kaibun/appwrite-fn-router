import './SimpleCodeEditorPrism.global.css';
// Patch: ensure Prism.languages.json is defined
if (!Prism.languages.json && Prism.languages.javascript) {
  Prism.languages.json = Prism.languages.javascript;
}
import { useUIContext } from '@src/theme/UIContext';
import { useRequestContext } from '../contexts/RequestContext';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
// @ts-ignore
require('prismjs/components/prism-json');

// Utility type: allows standard CSS properties and custom CSS variables (--*)
type CSSWithVars = React.CSSProperties & { [key: `--${string}`]: string };

export interface BodyProps {
  bodyOpen: boolean;
}

const Body: React.FC<BodyProps> = ({ bodyOpen }) => {
  const { palette, t } = useUIContext();
  const { method, body, setBody, bodyJsonError, readOnlyBody, isBodySynced } =
    useRequestContext();
  if (method === 'GET') return null;

  // Editor style with CSS variables
  const editorStyle: CSSWithVars = {
    border: isBodySynced
      ? '2px solid #00bcd4'
      : `1.5px solid ${palette.inputBorder}`,
    background: palette.inputBgEditable,
    color: palette.inputText,
    fontWeight: isBodySynced ? 600 : 400,
    transition: 'background 0.2s, border 0.2s',
    minHeight: 80,
    maxHeight: 320,
    overflow: 'auto',
    position: 'relative',
    zIndex: 2,
    '--input-bg': palette.inputBgEditable,
    '--input-text': palette.inputText,
    // Inject all Prism colors from palette.prism
    ...Object.fromEntries(
      Object.entries(palette.prism).map(([key, value]) => [
        `--prism-${key}`,
        value,
      ])
    ),
  };

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
        {/* Always show syntax highlighting, editable or not */}
        <div style={{ position: 'relative' }}>
          {!readOnlyBody && (
            <Editor
              value={body}
              onValueChange={setBody}
              highlight={(code) =>
                Prism.highlight(code, Prism.languages.json, 'json')
              }
              padding={8}
              className="codeEditor"
              style={editorStyle}
            />
          )}
          <div
            style={{
              marginTop: 4,
              position: 'relative',
              zIndex: 1,
              borderRadius: 6,
              overflow: 'hidden',
            }}
          >
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
                  zIndex: 3,
                }}
                title={t.bodySync}
              >
                SYNC
              </span>
            )}
          </div>
        </div>
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
