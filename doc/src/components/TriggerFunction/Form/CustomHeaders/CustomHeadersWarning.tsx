import React from 'react';
import { useTriggerFunctionContext } from '../../Context';
import { usePalette } from '../../../PaletteProvider';
import { isCorsSimpleHeader } from '../../Utils';

const CustomHeadersWarning: React.FC = () => {
  const { method, customHeaders, t } = useTriggerFunctionContext();
  const palette = usePalette();
  // Only check for non CORS-safelisted headers for methods that allow a body
  const methodsWithBody = ['POST', 'PATCH', 'PUT', 'DELETE'];
  const hasNonSimpleCustomHeader =
    methodsWithBody.includes(method) &&
    customHeaders.some((h) => h.key && !isCorsSimpleHeader(h.key, h.value));
  if (!hasNonSimpleCustomHeader) return null;
  return (
    <div
      style={{
        fontSize: 12,
        color: palette.errorText,
        marginTop: 8,
      }}
    >
      {t.customHeaderWarning} {t.seeDoc}&nbsp;
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
  );
};

export default CustomHeadersWarning;
