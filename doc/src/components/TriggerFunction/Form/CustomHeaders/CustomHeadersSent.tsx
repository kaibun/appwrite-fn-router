const CustomHeadersSent = ({ effectiveHeaders, t, palette }: any) => (
  <div style={{ flex: 1 }}>
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
