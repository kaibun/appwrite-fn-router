import { useEffect } from 'react';

import { useUIContext } from '@src/theme/UIContext';
import { useTriggerFunctionSync } from '@site/src/components/TriggerFunction/contexts/SyncContext';
import EditableParam from './EditableParam';
import { useRequestContext } from '../contexts/RequestContext';

interface EditableURLProps {
  editablePort?: boolean;
}

export default function EditableURL({
  editablePort = false,
}: EditableURLProps) {
  const { method, urlTemplate, params, setParams } = useRequestContext();
  const { palette, t } = useUIContext();
  const sync = useTriggerFunctionSync?.();

  // DEBUG: log params et isSynced pour chaque paramètre
  useEffect(() => {
    params.forEach((param) => {
      // eslint-disable-next-line no-console
      console.log('[EditableURL] param', {
        name: param.name,
        value: param.value,
        isSynced:
          !!sync?.urlParameters?.[param.name] &&
          param.value === sync.urlParameters[param.name],
      });
    });
  }, [params, sync?.urlParameters]);

  const urlParts = urlTemplate.split(/(:\w+)/g);

  return (
    <span
      style={{
        fontFamily: 'monospace',
        fontSize: 16,
        color: palette.textContrast,
      }}
    >
      <b style={{ color: palette.textContrast }}>{method}</b>{' '}
      {urlParts.map((part, i) => {
        if (part.startsWith(':')) {
          const name = part.slice(1);
          const param = params.find((p) => p.name === name);
          // DEBUG: log param transmis à EditableParam
          // eslint-disable-next-line no-console
          console.log('[EditableURL] map', { name, param });
          const isPort = name.toLowerCase() === 'port' || /^\d+$/.test(name);
          // Use sync.urlParameters for generic sync detection
          const isSynced =
            !!sync?.urlParameters?.[name] &&
            param?.value === sync.urlParameters[name];
          if (isPort && !editablePort) {
            return <span key={name}>{`:${param?.value || name}`}</span>;
          }
          if (isPort && editablePort) {
            return (
              <span
                key={name}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                :
                <EditableParam
                  name={name}
                  value={param?.value || ''}
                  placeholder={name}
                  onChange={(value) => {
                    setParams(
                      params.map((p) => (p.name === name ? { ...p, value } : p))
                    );
                  }}
                  isSynced={isSynced}
                />
              </span>
            );
          }
          return (
            <EditableParam
              key={name}
              name={name}
              value={param?.value || ''}
              placeholder={name}
              onChange={(value) => {
                setParams(
                  params.map((p) => (p.name === name ? { ...p, value } : p))
                );
              }}
              isSynced={isSynced}
            />
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
