const CustomHeadersList = ({
  customHeaders,
  setCustomHeaders,
  t,
  palette,
}: any) => (
  <>
    {customHeaders.map((h: any, idx: number) => {
      const keyId = `custom-header-key-${idx}`;
      const valueId = `custom-header-value-${idx}`;
      return (
        <div
          key={idx}
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 24px 1fr 24px',
            background: palette.inputBg,
            borderRadius: 6,
            border: `1.5px solid ${palette.inputBorder}`,
            position: 'relative',
            padding: '2px 0',
            marginBottom: 2,
          }}
        >
          <input
            id={keyId}
            type="text"
            placeholder={t.key}
            value={h.key}
            onChange={(e) => {
              const v = e.target.value;
              setCustomHeaders((chs: any) =>
                chs.map((c: any, i: number) =>
                  i === idx ? { ...c, key: v } : c
                )
              );
            }}
            style={{
              minWidth: 0,
              marginRight: 6,
              fontSize: 13,
              fontWeight: 400,
              color: palette.inputText,
              background: 'none',
              border: 'none',
              outline: 'none',
              padding: '4px 8px',
            }}
            aria-label={`${t.key} ${idx + 1}`}
          />
          <span
            style={{
              margin: '0 4px',
              color: palette.subtext,
              width: 'fit-content',
            }}
          >
            :
          </span>
          <input
            id={valueId}
            type="text"
            placeholder={t.value}
            value={h.value}
            onChange={(e) => {
              const v = e.target.value;
              setCustomHeaders((chs: any) =>
                chs.map((c: any, i: number) =>
                  i === idx ? { ...c, value: v } : c
                )
              );
            }}
            style={{
              marginRight: 6,
              fontSize: 13,
              fontWeight: 400,
              color: palette.inputText,
              background: 'none',
              border: 'none',
              outline: 'none',
              padding: '4px 8px',
            }}
            aria-label={`${t.value} ${idx + 1}`}
          />
          <button
            type="button"
            aria-label={t.removeHeader + ` ${idx + 1}`}
            onClick={() =>
              setCustomHeaders((chs: any) =>
                chs.filter((_: any, i: number) => i !== idx)
              )
            }
            style={{
              fontSize: 13,
              color: palette.errorText,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '2px 6px',
              width: 'fit-content',
            }}
            title={t.removeHeader}
          >
            ✕
          </button>
        </div>
      );
    })}
  </>
);

export default CustomHeadersList;
