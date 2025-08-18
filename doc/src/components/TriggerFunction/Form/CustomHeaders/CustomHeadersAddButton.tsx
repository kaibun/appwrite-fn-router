import React from 'react';

const CustomHeadersAddButton = ({ setCustomHeaders, t, palette }: any) => {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() =>
        setCustomHeaders((chs: any) => [...chs, { key: '', value: '' }])
      }
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: 13,
        marginTop: 2,
        background: palette.inputBg,
        border: `1px solid ${hover ? palette.accent : palette.inputBorder}`,
        borderRadius: 6,
        padding: '2px 12px',
        cursor: 'pointer',
        color: palette.accent,
        fontWeight: 600,
      }}
    >
      {t.addHeader}
    </button>
  );
};

export default CustomHeadersAddButton;
