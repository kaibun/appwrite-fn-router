import { useUIContext } from '@src/theme/UIContext';
import { useTriggerFunctionContext } from '../../contexts/TriggerFunctionContext';
import { isCorsSimpleHeader } from '../../utils';

const CustomHeadersWarning: React.FC = () => {
  const { palette, t } = useUIContext();
  const { method, customHeaders } = useTriggerFunctionContext();

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
        href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: palette.accent2 }}
      >
        {t.mdnCors}
      </a>
      {' - '}
      <a
        href="https://fetch.spec.whatwg.org/#simple-header"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: palette.accent2 }}
      >
        {t.fetchSpec}
      </a>
    </div>
  );
};

export default CustomHeadersWarning;
