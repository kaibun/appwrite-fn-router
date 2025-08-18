import React from 'react';

const CustomHeadersSent = ({ effectiveHeaders, t, palette }: any) => (
  <div style={{ flex: 1 }}>
    <label
      style={{
        display: 'block',
        fontSize: 13,
        marginBottom: 2,
        color: palette.subtext,
      }}
    >
      {t.sentHeaders}
    </label>
    <pre
      style={{
        background: palette.inputBg,
        padding: 8,
        borderRadius: 6,
        fontSize: 13,
        margin: 0,
        overflowX: 'auto',
        color: palette.inputText,
      }}
    >
      {JSON.stringify(effectiveHeaders, null, 2)}
    </pre>
  </div>
);

export default CustomHeadersSent;
