import React from 'react';
import { usePalette } from '@src/components/PaletteProvider';
import { useI18n } from '@src/components/I18nProvider';

import type { Param } from '../Types';

export interface ParamsProps {
  paramNames: string[];
  params: Param[];
  setParams: React.Dispatch<React.SetStateAction<Param[]>>;
}

const Params: React.FC<ParamsProps> = ({ paramNames, params, setParams }) => {
  const palette = usePalette();
  const t = useI18n();
  return (
    <>
      {paramNames.length > 0 && (
        <fieldset style={{ margin: '8px 0 18px 0', border: 0, padding: 0 }}>
          <legend
            style={{ fontSize: 13, marginBottom: 4, color: palette.subtext }}
          >
            {t.params}
          </legend>
          <div style={{ display: 'flex', gap: 16 }}>
            {paramNames.map((name: string, idx: number) => {
              const inputId = `param-${name}-${idx}`;
              return (
                <label
                  key={name}
                  htmlFor={inputId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    position: 'relative',
                    minWidth: 120,
                  }}
                >
                  <span style={{ fontSize: 13, marginRight: 4 }}>{name}:</span>
                  <input
                    id={inputId}
                    type="text"
                    value={
                      params.find((p: Param) => p.name === name)?.value || ''
                    }
                    onChange={(e) =>
                      setParams((ps: Param[]) =>
                        ps.map((p: Param) =>
                          p.name === name ? { ...p, value: e.target.value } : p
                        )
                      )
                    }
                    style={{
                      marginLeft: 0,
                      width: 120,
                      background:
                        name === 'id' &&
                        params.find((p) => p.name === name)?.value
                          ? '#e0f7fa'
                          : palette.inputBg,
                      border:
                        name === 'id' &&
                        params.find((p) => p.name === name)?.value
                          ? '2px solid #00bcd4'
                          : `1.5px solid ${palette.inputBorder}`,
                      borderRadius: 6,
                      fontWeight:
                        name === 'id' &&
                        params.find((p) => p.name === name)?.value
                          ? 600
                          : 400,
                      color:
                        name === 'id' &&
                        params.find((p) => p.name === name)?.value
                          ? '#00796b'
                          : palette.inputText,
                      fontSize: 14,
                      padding: '4px 8px',
                      transition: 'background 0.2s, border 0.2s',
                    }}
                    aria-label={name}
                  />
                  {/* Badge SYNC pour l’id synchronisé */}
                  {name === 'id' &&
                    params.find((p) => p.name === name)?.value && (
                      <span
                        style={{
                          position: 'absolute',
                          right: -38,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: '#00bcd4',
                          color: '#fff',
                          borderRadius: 12,
                          padding: '2px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          marginLeft: 6,
                          boxShadow: '0 1px 4px #00bcd455',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                          letterSpacing: 0.5,
                        }}
                        title="Synchronisé avec la dernière création"
                      >
                        SYNC
                      </span>
                    )}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}
    </>
  );
};

export default Params;
