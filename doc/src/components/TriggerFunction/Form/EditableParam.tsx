import React from 'react';
import { usePalette } from '@src/components/PaletteProvider';

interface EditableParamProps {
  name: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
  isSynced?: boolean;
}

export default function EditableParam({
  name,
  value,
  placeholder,
  onChange,
  isSynced = false,
}: EditableParamProps) {
  const palette = usePalette();
  React.useEffect(() => {
    const styleId = 'editable-param-placeholder-style';
    if (document.getElementById(styleId)) return;
    const style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = `
      input::placeholder {
        color: ${palette.subtext};
        opacity: 1;
      }
      [data-theme='dark'] input::placeholder {
        color: ${palette.inputText};
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  }, [palette.subtext, palette.inputText]);
  return (
    <span
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || name}
        style={{
          width: Math.max(60, value.length * 10 + 30),
          background:
            isSynced && name === 'id' && value ? '#e0f7fa' : palette.inputBg,
          color:
            isSynced && name === 'id' && value ? '#00796b' : palette.inputText,
          border:
            isSynced && name === 'id' && value
              ? '2px solid #00bcd4'
              : `1.5px solid ${palette.inputBorder}`,
          borderRadius: 6,
          fontWeight: isSynced && name === 'id' && value ? 600 : 500,
          fontSize: 14,
          padding: '2px 8px',
          margin: '0 2px',
          outline: 'none',
          transition: 'background 0.2s, border 0.2s',
        }}
        aria-label={name}
      />
      {isSynced && name === 'id' && value && (
        <span
          style={{
            position: 'absolute',
            right: -38,
            top: '50%',
            transform: 'translateY(-50%)',
            background: '#00bcd4',
            color: '#fff',
            borderRadius: 12,
            padding: '2px 10px',
            fontSize: 11,
            fontWeight: 700,
            marginLeft: 6,
            boxShadow: '0 1px 4px #00bcd455',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            letterSpacing: 0.5,
          }}
          title="Synchronisé avec la dernière création"
        >
          SYNC
        </span>
      )}
    </span>
  );
}
