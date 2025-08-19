import { useEffect, useState, useMemo } from 'react';

import type { Param } from './Form/Params';
import type { MockApiResponse } from './Types';

import { ParamsContext } from './contexts/ParamsContext';
import { BodyContext } from './contexts/BodyContext';
import { HeadersContext } from './contexts/HeadersContext';
import { RequestContext } from './contexts/RequestContext';

import { useUIContext } from '@src/theme/UIContext';
import { extractParams, isCorsSimpleHeader } from './utils';
import { predefinedHeaders } from './config';
import TriggerFunctionForm from './Form';
import { TriggerFunctionContext } from './contexts/TriggerFunctionContext';
import TriggerFunctionResult from './Result';
import TriggerFunctionHistory from './History';
import TriggerFunctionDebug from './Debug';
import { useTriggerFunctionSync } from './contexts/SyncContext';
import { getOrCreateWidgetUserId } from './utils/useWidgetUserId';
import { ResponseContext } from './contexts/ResponseContext';
import PreRequestError from './PreRequestError';
import { scrollToWithHeaderOffset } from './utils/scrollToWithHeaderOffset';
import ResponseFacade from './utils/ResponseFacade';

export interface TriggerFunctionProps {
  method: string;
  url: string;
  body?: any;
  headers?: Record<string, string>;
  label?: string;
  step?: number;
  onStepDone?: (response: any) => void;
  showHttpError?: boolean;
  showUrlDebug?: boolean;
  showDebugInfo?: boolean;
  readOnlyBody?: boolean;
  mockApi?: (params: {
    method: string;
    url: string;
    body?: any;
    headers: Record<string, string>;
  }) => Promise<MockApiResponse> | MockApiResponse;
  bodyOpenDefault?: boolean;
  headersOpenDefault?: boolean;
}

const TriggerFunction: React.FC<TriggerFunctionProps> = ({
  method,
  url,
  body: initialBody,
  headers = {},
  label = 'Trigger Function',
  step = 1,
  onStepDone,
  showHttpError = true,
  showUrlDebug = false,
  showDebugInfo = false,
  readOnlyBody = false,
  mockApi,
  bodyOpenDefault = ['POST', 'PATCH'].includes(method),
  headersOpenDefault = false,
}) => {
  const { palette, t } = useUIContext();

  // Contextual synchronization
  const sync = useTriggerFunctionSync();

  // Persistent user ID (localStorage)
  const [widgetUserId] = useState(() =>
    typeof window !== 'undefined' && getOrCreateWidgetUserId
      ? getOrCreateWidgetUserId()
      : ''
  );

  // Synchronization detection for body and headers
  const isBodySynced = !initialBody && !!sync.lastWidgetBody;
  const isHeadersSynced =
    (!headers || Object.keys(headers).length === 0) && !!sync.lastWidgetHeaders;

  // Main states
  const [body, setBody] = useState(
    initialBody
      ? JSON.stringify(initialBody, null, 2)
      : isBodySynced
        ? JSON.stringify(sync.lastWidgetBody, null, 2)
        : ''
  );
  // Initial headers: from props, sync, or config
  const initialHeaders =
    headers && Object.keys(headers).length > 0
      ? Object.entries(headers).map(([key, value]) => ({
          key,
          value: String(value),
          enabled: true,
          corsEnabled: false,
        }))
      : isHeadersSynced
        ? Object.entries(sync.lastWidgetHeaders ?? {}).map(([key, value]) => ({
            key,
            value: String(value),
            enabled: true,
            corsEnabled: false,
          }))
        : predefinedHeaders;
  const [customHeaders, setCustomHeaders] = useState<
    {
      key: string;
      value: string;
      enabled: boolean;
      corsEnabled?: boolean;
      dynamic?: boolean;
    }[]
  >(initialHeaders);

  const paramNames: string[] = extractParams(url);
  const [params, setParams] = useState<Param[]>(
    // Initialize each URL parameter with an empty value,
    // except for those present in sync.urlParameters.
    paramNames.map((name: string) => {
      if (sync.urlParameters && sync.urlParameters[name]) {
        return { name, value: sync.urlParameters[name] };
      }
      return { name, value: '' };
    })
  );

  // Let’s compute a URL with injected parameters, taking into account synced
  // params.
  const computedUrl = paramNames.reduce((acc: string, name: string) => {
    const val = params.find((p) => p.name === name)?.value || '';
    return acc.replace(`:${name}`, val);
  }, url);

  // Synchronisation dynamique de l’id si le contexte change
  useEffect(() => {
    // We synchronize local params from sync.urlParameters, but keep params as local state
    // to allow user editing. Reading sync.urlParameters directly would overwrite user input
    // on every context change. This pattern enables both global sync and local editing.
    setParams((ps) =>
      ps.map((p) =>
        sync.urlParameters[p.name]
          ? { ...p, value: sync.urlParameters[p.name] }
          : p
      )
    );
  }, [sync.urlParameters]);

  const [useAuth, setUseAuth] = useState(false);
  // Stocke la façade autour du Response original
  const [responseFacade, setResponseFacade] = useState<ResponseFacade | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [bodyJsonError, setBodyJsonError] = useState<string | null>(null);
  const [preRequestError, setPreRequestError] = useState<string | null>(null);

  // Effective headers
  const effectiveHeaders = useMemo(() => {
    const headersObj: Record<string, string> = {};
    customHeaders.forEach((h) => {
      if (h.enabled && h.key && h.value) headersObj[h.key] = h.value;
    });
    if (body) headersObj['Content-Type'] = 'application/json';
    if (widgetUserId) headersObj['X-Widget-User-Id'] = widgetUserId;
    return headersObj;
  }, [customHeaders, body, widgetUserId]);

  // Only check for non CORS-safelisted headers for methods that allow a body
  const hasNonSimpleCustomHeader = useMemo(() => {
    const methodsWithBody = ['POST', 'PATCH', 'PUT', 'DELETE'];
    if (!methodsWithBody.includes(method)) return false;
    // Ne prendre en compte que les headers effectivement envoyés
    return customHeaders.some(
      (h) =>
        h.enabled && h.key && h.value && !isCorsSimpleHeader(h.key, h.value)
    );
  }, [customHeaders, method]);

  // Handling missing parameters
  const missingParam = paramNames.find(
    (name: string) => !params.find((p) => p.name === name)?.value
  );

  // Sending the request (mock or real)
  const onSend = async () => {
    if (missingParam) {
      setPreRequestError(
        `Erreur : le paramètre « ${missingParam} » est requis dans l’URL.`
      );
      // (nettoyé) : suppression de l'ancien state responseObj
      setLoading(false);
      return;
    }
    setPreRequestError(null);
    setLoading(true);
    // (nettoyé) : suppression de l'ancien state responseObj
    setBodyJsonError(null);
    const start = performance.now();
    let parsedBody: any = body;
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (e) {
        setBodyJsonError('Body JSON invalide');
        setLoading(false);
        return;
      }
    }
    // Si mockApi est fourni, intercepte ici
    if (mockApi) {
      try {
        const mockRes = await mockApi({
          method,
          url: computedUrl,
          body: parsedBody,
          headers: effectiveHeaders,
        });
        // setResponseObj is called below with the Response-like object
        // Add to global history
        sync.addHistory({
          req: { method, url: computedUrl, body: parsedBody },
          res: mockRes.body,
        });
        // Synchronize context after widget creation
        const isWidgetPost =
          method === 'POST' && /\/widgets(\b|\/|$)/.test(url);
        if (isWidgetPost) {
          try {
            const data = JSON.parse(mockRes.body);
            if (data && typeof data.id === 'string') {
              sync.setUrlParameter('id', data.id);
              sync.setLastWidgetBody(parsedBody);
              const custom = customHeaders.filter((h) => h.key);
              const customObj = Object.fromEntries(
                custom.map((h) => [h.key, h.value])
              );
              sync.setLastWidgetHeaders(customObj);
            }
          } catch (e) {}
        }
      } catch (err: any) {
        // (nettoyé) : suppression de l'ancien state responseObj
      } finally {
        setLoading(false);
      }
      return;
    }
    // Sinon, requête réseau réelle
    try {
      const res = await fetch(computedUrl, {
        method,
        headers: effectiveHeaders,
        body:
          parsedBody && method !== 'GET'
            ? JSON.stringify(parsedBody)
            : undefined,
      });
      const facade = new ResponseFacade(res);
      setResponseFacade(facade);
      // Always read the body on a clone from the facade
      // Never on the original Response, to avoid stream errors
      const resText = await facade.getResponse().text();
      sync?.addHistory &&
        sync.addHistory({
          req: { method, url: computedUrl, body: parsedBody },
          res: resText,
        });
      // Auto-scroll to the Result component of the current step only on success
      if (res.status < 400) {
        setTimeout(() => {
          const resultEl = document.getElementById(
            `trigger-function-result-step-${step}`
          );
          if (resultEl) {
            scrollToWithHeaderOffset(resultEl);
          }
        }, 100);
      }
      // Automatic progression: onStepDone called on success
      const isWidgetPost = method === 'POST' && /\/widgets(\b|\/|$)/.test(url);
      if (isWidgetPost && sync) {
        try {
          const data = JSON.parse(resText);
          if (data && typeof data.id === 'string') {
            sync.setUrlParameter('id', data.id);
            sync.setLastWidgetBody(parsedBody);
            const custom = customHeaders.filter((h) => h.key);
            const customObj = Object.fromEntries(
              custom.map((h) => [h.key, h.value])
            );
            sync.setLastWidgetHeaders(customObj);
          }
        } catch (e) {}
      }
      // Call automatic progression as in deprecated.tsx
      if (res.status < 400 && onStepDone) {
        onStepDone(resText);
      }
    } catch (err: any) {
    } finally {
      setLoading(false);
    }
  };

  // Debug info
  const rawUrlProp = url;
  let urlWarning: string | null = null;
  if (computedUrl.startsWith('/')) {
    urlWarning = t.urlWarningRelative;
  } else if (
    /localhost(:\d+)?/.test(computedUrl) &&
    !/localhost:\d+/.test(computedUrl)
  ) {
    urlWarning = t.urlWarningLocalhostNoPort;
  } else if (computedUrl.includes('undefined')) {
    urlWarning = t.urlWarningUndefined;
  }

  // Détermine si la dernière réponse est une erreur HTTP
  const httpError = !!(
    responseFacade?.getResponse() && responseFacade.getResponse().status >= 400
  );

  return (
    <RequestContext.Provider
      value={{
        method,
        urlTemplate: url,
        computedUrl,
        params,
        setParams,
        body,
        setBody,
        bodyJsonError,
        readOnlyBody,
        isBodySynced,
      }}
    >
      <ParamsContext.Provider value={{ params, setParams }}>
        <BodyContext.Provider value={{ body, setBody, bodyJsonError }}>
          <HeadersContext.Provider
            value={{
              headers: customHeaders,
              setHeaders: setCustomHeaders,
              hasNonSimpleCustomHeader,
              effectiveHeaders,
            }}
          >
            <TriggerFunctionContext.Provider
              value={{
                method,
                customHeaders,
                effectiveHeaders,
                computedUrl,
                label,
                setCustomHeaders,
              }}
            >
              <ResponseContext.Provider
                value={{
                  response: responseFacade?.getResponse() ?? null,
                  httpError,
                }}
              >
                <div
                  style={{
                    border: `1px solid ${palette.border}`,
                    borderRadius: 12,
                    background: palette.inputBg,
                    color: palette.inputText,
                    margin: '0 auto',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                  }}
                >
                  <TriggerFunctionDebug
                    showDebugInfo={showDebugInfo}
                    showUrlDebug={showUrlDebug}
                    rawUrlProp={rawUrlProp}
                    computedUrl={computedUrl}
                    urlWarning={urlWarning}
                    method={method}
                  />
                  <TriggerFunctionForm
                    onSend={onSend}
                    loading={loading}
                    label={label}
                    headersOpen={showDebugInfo ? true : headersOpenDefault}
                    bodyOpen={showDebugInfo ? true : bodyOpenDefault}
                  />
                  {responseFacade && (
                    <div id={`trigger-function-result-step-${step}`}>
                      <TriggerFunctionResult
                        response={responseFacade.getResponse()}
                      />
                    </div>
                  )}
                  {preRequestError && (
                    <PreRequestError
                      error={preRequestError}
                      color={palette.errorText}
                    />
                  )}
                  {!!(sync?.history && sync.history.length) && (
                    <TriggerFunctionHistory history={sync.history} />
                  )}
                </div>
              </ResponseContext.Provider>
            </TriggerFunctionContext.Provider>
          </HeadersContext.Provider>
        </BodyContext.Provider>
      </ParamsContext.Provider>
    </RequestContext.Provider>
  );
};

export default TriggerFunction;
