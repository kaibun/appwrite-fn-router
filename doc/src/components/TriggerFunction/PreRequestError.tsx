import React from 'react';

interface PreRequestErrorProps {
  error: string;
  color?: string;
}

export default function PreRequestError({
  error,
  color,
}: PreRequestErrorProps) {
  return (
    <div
      style={{ color: color ?? '#d32f2f', fontSize: 14, margin: '18px 24px' }}
      role="alert"
    >
      <strong>Erreur de requête</strong> <br />
      {error}
    </div>
  );
}
