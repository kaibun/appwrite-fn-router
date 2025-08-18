// Main orchestrator component

import React, { useState, useMemo } from 'react';
import type { Param, MockApiResponse, TriggerFunctionProps } from './Types';
import { extractParams, isCorsSimpleHeader } from './Utils';
import TriggerFunctionForm from './Form';
import { TriggerFunctionContext } from './Context';
import TriggerFunctionResult from './Result';
import TriggerFunctionHistory from './History';
import TriggerFunctionDebug from './Debug';
import { messages } from './I18n';
import { useTriggerFunctionSync } from './SyncContext';
import { useDocusaurusLocale } from '../useDocusaurusLocale';
import { useDocusaurusColorMode } from '../useDocusaurusColorMode';
import { getOrCreateWidgetUserId } from '../useWidgetUserId';
import PreRequestError from './PreRequestError';
import { scrollToWithHeaderOffset } from './scrollToWithHeaderOffset';

// Main component

const TriggerFunction: React.FC<TriggerFunctionProps> = ({
  method,
  url,
  body: initialBody,
  headers = {},
  label = 'Trigger Function',
  urlParams,
  step = 1,
  onStepDone,
  showHttpError = true,
  showUrlDebug = false,
  showDebugInfo = false,
  readOnlyBody = false,
  mockApi,
  bodyOpenDefault = ['POST', 'PATCH'].includes(method),
  headersOpenDefault = true,
}) => {
  // UI language (Docusaurus or fallback)
  const lang = useDocusaurusLocale?.() || 'en';
  const t = (messages as any)[lang] || messages.fr;

  // Color mode (light/dark)
  const colorMode = useDocusaurusColorMode?.();
  const palette =
    colorMode === 'dark'
      ? {
          // dark theme
          accent: '#BCD0F0FF',
          accent2: '#93C4CDFF',
          border: '#26324a',
          debugBg: '#2CB797FF',
          errorText: '#ffb3b3',
          errorBg: '#2a1a1a',
          inputBg: '#232b3a',
          inputText: '#eaf2ff',
          inputBorder: '#3b82f6',
          resultBg: '#6F1D70FF',
          sectionBg: '#E1D9D9FF',
          subtext: '#b3bedc',
          text: '#ffffff',
        }
      : {
          // light theme
          accent: '#3b82f6',
          accent2: '#6366f1',
          border: '#e5e7eb',
          debugBg: '#FFCD4FFF',
          errorText: '#ef4444',
          errorBg: '#fee2e2',
          inputBg: '#f3f4f6',
          inputText: '#111827',
          inputBorder: '#d1d5db',
          resultBg: '#FFDC84FF',
          sectionBg: '#1A68EFFF',
          subtext: '#6b7280',
          text: '#000000',
        };

  // Contextual synchronization
  let sync: ReturnType<typeof useTriggerFunctionSync> | undefined = undefined;
  try {
    sync = useTriggerFunctionSync();
    // Debug: log the sync context value at each render
    // console.log('[TriggerFunction] sync context', sync);
    if (sync) {
      // console.log('[TriggerFunction] sync.lastWidgetId', sync.lastWidgetId);
      // console.log('[TriggerFunction] sync.lastWidgetBody', sync.lastWidgetBody);
      // console.log(
      //   '[TriggerFunction] sync.lastWidgetHeaders',
      //   sync.lastWidgetHeaders
      // );
    }
  } catch {}

  // Persistent user ID (localStorage)
  const [widgetUserId] = useState(() =>
    typeof window !== 'undefined' && getOrCreateWidgetUserId
      ? getOrCreateWidgetUserId()
      : ''
  );

  // Dynamic parameters
  const paramNames: string[] = urlParams || extractParams(url);

  // Synchronization detection for body and headers
  const isBodySynced = !initialBody && !!sync?.lastWidgetBody;
  const isHeadersSynced =
    (!headers || Object.keys(headers).length === 0) &&
    !!sync?.lastWidgetHeaders;

  // Main states
  const [body, setBody] = useState(
    initialBody
      ? JSON.stringify(initialBody, null, 2)
      : isBodySynced
        ? JSON.stringify(sync?.lastWidgetBody, null, 2)
        : ''
  );
  const [customHeaders, setCustomHeaders] = useState<
    { key: string; value: string }[]
  >(
    headers && Object.keys(headers).length > 0
      ? Object.entries(headers).map(([key, value]) => ({
          key,
          value: String(value),
        }))
      : isHeadersSynced
        ? Object.entries(sync?.lastWidgetHeaders ?? {}).map(([key, value]) => ({
            key,
            value: String(value),
          }))
        : []
  );
  const [params, setParams] = useState<Param[]>(
    paramNames.map((name: string) => {
      if (name === 'id' && sync?.lastWidgetId) {
        return { name, value: sync.lastWidgetId };
      }
      return { name, value: '' };
    })
  );

  // Synchronisation dynamique de l’id si le contexte change
  React.useEffect(() => {
    if (sync?.lastWidgetId) {
      setParams((ps) =>
        ps.map((p) =>
          p.name === 'id' && sync ? { ...p, value: sync.lastWidgetId ?? '' } : p
        )
      );
    }
  }, [sync?.lastWidgetId]);

  const [useAuth, setUseAuth] = useState(false);
  const [responseObj, setResponseObj] = useState<Response | null>(null);
  const [loading, setLoading] = useState(false);
  const [bodyJsonError, setBodyJsonError] = useState<string | null>(null);
  const [preRequestError, setPreRequestError] = useState<string | null>(null);

  // Addition: URL computed with injected parameters
  const computedUrl = paramNames.reduce((acc: string, name: string) => {
    const val = params.find((p) => p.name === name)?.value || '';
    return acc.replace(`:${name}`, val);
  }, url);

  // Effective headers
  const effectiveHeaders = useMemo(() => {
    const headersObj: Record<string, string> = {};
    customHeaders.forEach((h) => {
      if (h.key) headersObj[h.key] = h.value;
    });
    if (useAuth) headersObj['Authorization'] = 'Bearer <token>';
    if (body) headersObj['Content-Type'] = 'application/json';
    if (widgetUserId) headersObj['X-Widget-User-Id'] = widgetUserId;
    return headersObj;
  }, [customHeaders, useAuth, body, widgetUserId]);

  // Only check for non CORS-safelisted headers for methods that allow a body
  const hasNonSimpleCustomHeader = useMemo(() => {
    const methodsWithBody = ['POST', 'PATCH', 'PUT', 'DELETE'];
    if (!methodsWithBody.includes(method)) return false;
    return customHeaders.some(
      (h) => h.key && !isCorsSimpleHeader(h.key, h.value)
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
      setResponseObj(null);
      setLoading(false);
      return;
    }
    setPreRequestError(null);
    setLoading(true);
    setResponseObj(null);
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
        sync?.addHistory &&
          sync.addHistory({
            req: { method, url: computedUrl, body: parsedBody },
            res: mockRes.body,
          });
        // Synchronize context after widget creation
        const isWidgetPost =
          method === 'POST' && /\/widgets(\b|\/|$)/.test(url);
        if (isWidgetPost && sync) {
          try {
            const data = JSON.parse(mockRes.body);
            if (data && typeof data.id === 'string') {
              sync.setLastWidgetId(data.id);
              sync.setLastWidgetBody(parsedBody);
              const custom = customHeaders.filter((h) => h.key);
              const customObj = Object.fromEntries(
                custom.map((h) => [h.key, h.value])
              );
              sync.setLastWidgetHeaders(customObj);
            }
          } catch {}
        }
      } catch (err: any) {
        setResponseObj(null);
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
      setResponseObj(res);
      // Ajout dans l’historique global
      sync?.addHistory &&
        sync.addHistory({
          req: { method, url: computedUrl, body: parsedBody },
          res: await res.clone().text(),
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
          const widgetText = await res.clone().text();
          const data = JSON.parse(widgetText);
          if (data && typeof data.id === 'string') {
            sync.setLastWidgetId(data.id);
            sync.setLastWidgetBody(parsedBody);
            const custom = customHeaders.filter((h) => h.key);
            const customObj = Object.fromEntries(
              custom.map((h) => [h.key, h.value])
            );
            sync.setLastWidgetHeaders(customObj);
          }
        } catch {}
      }
      // Call automatic progression as in deprecated.tsx
      if (res.status < 400 && onStepDone) {
        onStepDone(await res.clone().text());
      }
    } catch (err: any) {
      setResponseObj(null);
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

  // cURL button component
  const CurlCopyButton = (props: any) => (
    <button
      style={{
        background: palette.border,
        color: palette.inputText,
        border: 'none',
        borderRadius: 6,
        padding: '8px 10px',
        fontSize: 13,
        cursor: 'pointer',
        margin: 0,
      }}
      onClick={() => {
        const curl = `curl -X ${props.method} '${props.url}'`;
        navigator.clipboard.writeText(curl);
        alert('cURL copied!');
      }}
    >
      Copy cURL
    </button>
  );

  // For GET, the body must be empty and not editable
  const isGetMethod = method === 'GET';
  const effectiveBody = isGetMethod ? '' : body;
  const effectiveReadOnlyBody = isGetMethod ? true : readOnlyBody;

  return (
    <TriggerFunctionContext.Provider
      value={{
        method,
        customHeaders,
        t,
        useAuth,
        setUseAuth,
        effectiveHeaders,
        palette,
        computedUrl,
        label,
        setCustomHeaders,
      }}
    >
      <div
        style={{
          border: `1px solid ${palette.border}`,
          borderRadius: 12,
          background: palette.inputBg,
          color: palette.inputText,
          // maxWidth: 700,
          margin: '0 auto',
          // padding: '24px',
          // boxShadow: '0 2px 12px #0001',
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
          paramNames={paramNames}
          params={params}
          setParams={setParams}
          body={body}
          setBody={setBody}
          bodyJsonError={bodyJsonError}
          readOnlyBody={readOnlyBody}
          isBodySynced={isBodySynced}
          isHeadersSynced={isHeadersSynced}
          onSend={onSend}
          loading={loading}
          CurlCopyButton={CurlCopyButton}
          label={label}
          headersOpen={showDebugInfo ? true : headersOpenDefault}
          bodyOpen={showDebugInfo ? true : bodyOpenDefault}
        />
        {responseObj && (
          <div id={`trigger-function-result-step-${step}`}>
            <TriggerFunctionResult response={responseObj!} />
          </div>
        )}
        {preRequestError && (
          <PreRequestError error={preRequestError} color={palette.errorText} />
        )}
        {!!(sync?.history && sync.history.length) && (
          <TriggerFunctionHistory
            history={sync.history}
            palette={palette}
            t={t}
          />
        )}
      </div>
    </TriggerFunctionContext.Provider>
  );
};

export default TriggerFunction;
