import React from 'react';

const CustomHeadersWarning = ({ hasNonSimpleCustomHeader, t, palette }: any) =>
  hasNonSimpleCustomHeader ? (
    <div
      style={{
        fontSize: 12,
        color: palette.errorText,
        marginTop: 8,
      }}
    >
      {t.customHeaderWarning}
      <br />
      {t.seeDoc}&nbsp;
      <a
        href="https://developer.mozilla.org/fr/docs/Web/HTTP/CORS#acc%C3%A9der_ressources_avec_credentiels"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: palette.accent2 }}
      >
        {t.mdnCors}
      </a>
      .
    </div>
  ) : null;

export default CustomHeadersWarning;
