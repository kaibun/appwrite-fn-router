interface PreRequestErrorProps {
  error: string;
  color?: string;
}

import { useUIContext } from '../../theme/UIContext';

export default function PreRequestError({
  error,
  color,
}: PreRequestErrorProps) {
  const { t } = useUIContext();
  return (
    <div
      style={{ color: color ?? '#d32f2f', fontSize: 14, margin: '18px 24px' }}
      role="alert"
    >
      <strong>{t('preRequestErrorLabel')}</strong> <br />
      {error}
    </div>
  );
}
