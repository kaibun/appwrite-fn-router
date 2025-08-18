import { useState } from 'react';
import { useUIContext } from '@src/theme/UIContext';
import { useTriggerFunctionContext } from '../../contexts/TriggerFunctionContext';

const CustomHeadersAddButton = () => {
  const [hover, setHover] = useState(false);
  const { setCustomHeaders } = useTriggerFunctionContext();
  const { palette, t } = useUIContext();
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
