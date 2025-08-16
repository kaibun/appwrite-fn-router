import React from 'react';
import EditableParam from './EditableParam';
import { usePalette } from '@src/components/PaletteProvider';
import { useTriggerFunctionSync } from '../SyncContext';

import type { Param } from '../Types';

interface EditableURLProps {
  urlTemplate: string;
  params: Param[];
  setParams: React.Dispatch<React.SetStateAction<Param[]>>;
  method: string;
  editablePort?: boolean;
}

// Remplace les :param dans l’URL par des inputs
export default function EditableURL({
  urlTemplate,
  params,
  setParams,
  method,
  editablePort = false,
}: EditableURLProps) {
  const palette = usePalette();
  const sync = useTriggerFunctionSync?.();
  // Découpe l’URL en segments, remplace chaque :param par un input
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
          const isPort = name.toLowerCase() === 'port' || /^\d+$/.test(name);
          const isSynced =
            name === 'id' &&
            !!sync?.lastWidgetId &&
            param?.value === sync.lastWidgetId;
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
                    setParams((ps) =>
                      ps.map((p) => (p.name === name ? { ...p, value } : p))
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
                setParams((ps) =>
                  ps.map((p) => (p.name === name ? { ...p, value } : p))
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
