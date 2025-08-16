// Composant principal orchestrateur

import React, { useState, useMemo } from 'react';
import type { Param, MockApiResponse, TriggerFunctionProps } from './Types';
import { extractParams, isCorsSimpleHeader } from './Utils';
import TriggerFunctionForm from './Form';
import TriggerFunctionResult from './Result';
import TriggerFunctionHistory from './History';
import TriggerFunctionDebug from './Debug';
import { messages } from './I18n';
import { useTriggerFunctionSync } from './SyncContext';
import { useDocusaurusLocale } from '../useDocusaurusLocale';
import { useDocusaurusColorMode } from '../useDocusaurusColorMode';
import { getOrCreateWidgetUserId } from '../useWidgetUserId';

// Composant principal
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
  showUrlDebug = true,
  showDebugInfo = true,
  readOnlyBody = false,
  mockApi,
}) => {
  // Langue UI (Docusaurus ou fallback)
  const lang = useDocusaurusLocale?.() || 'fr';
  const t = (messages as any)[lang] || messages.fr;

  // Color mode (light/dark)
  const colorMode = useDocusaurusColorMode?.();
  const palette =
    colorMode === 'dark'
      ? {
          accent: '#3b82f6',
          accent2: '#06b6d4',
          debugBg: '#FFDC84FF',
          errorText: '#ffb3b3',
          errorBg: '#2a1a1a',
          inputBg: '#232b3a',
          inputText: '#eaf2ff',
          inputBorder: '#3b82f6',
          sectionBg: '#E1D9D9FF',
          subtext: '#b3bedc',
          border: '#26324a',
        }
      : {
          accent: '#3b82f6',
          accent2: '#6366f1',
          debugBg: '#FFDC84FF',
          errorText: '#ef4444',
          errorBg: '#fee2e2',
          inputBg: '#f3f4f6',
          inputText: '#111827',
          inputBorder: '#d1d5db',
          sectionBg: '#1A68EFFF',
          subtext: '#6b7280',
          border: '#e5e7eb',
        };

  // Synchronisation contextuelle
  let sync: ReturnType<typeof useTriggerFunctionSync> | undefined = undefined;
  try {
    sync = useTriggerFunctionSync?.();
  } catch {}

  // ID utilisateur persistant (localStorage)
  const [widgetUserId] = useState(() =>
    typeof window !== 'undefined' && getOrCreateWidgetUserId
      ? getOrCreateWidgetUserId()
      : ''
  );

  // États pour la réponse, erreur, chargement, etc.
  const [response, setResponse] = useState<string | null>(null);
  const [httpError, setHttpError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<
    string,
    string
  > | null>(null);
  const [bodyJsonError, setBodyJsonError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [useAuth, setUseAuth] = useState(false);

  // Gestion des paramètres dynamiques de l’URL
  const paramNames: string[] = urlParams || extractParams(url);

  // Détection de synchronisation pour body et headers
  const isBodySynced = !initialBody && !!sync?.lastWidgetBody;
  const isHeadersSynced =
    (!headers || Object.keys(headers).length === 0) &&
    !!sync?.lastWidgetHeaders;

  // Pré-remplit le body si synchronisé (sauf si initialBody fourni explicitement)
  const [body, setBody] = useState(
    initialBody
      ? JSON.stringify(initialBody, null, 2)
      : isBodySynced
        ? JSON.stringify(sync?.lastWidgetBody, null, 2)
        : ''
  );

  // Headers custom dynamiques (clé/valeur), synchronisés si disponibles
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

  // Si un id synchronisé existe, pré-remplit le param id
  const [params, setParams] = useState<Param[]>(
    paramNames.map((name: string) => {
      if (name === 'id' && sync?.lastWidgetId) {
        return { name, value: sync.lastWidgetId };
      }
      return { name, value: '' };
    })
  );
  // ...existing code...

  // Calcul de l’URL réelle à partir de la prop url (avec reduce)
  const computedUrl = useMemo(() => {
    return paramNames.reduce((acc: string, name: string) => {
      const val = params.find((p) => p.name === name)?.value || `<${name}>`;
      return acc.replace(`:${name}`, val);
    }, url);
  }, [params, url, paramNames]);

  // Headers effectifs
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

  // Vérification des headers non CORS-safelisted
  const hasNonSimpleCustomHeader = useMemo(() => {
    return customHeaders.some(
      (h) => h.key && !isCorsSimpleHeader(h.key, h.value)
    );
  }, [customHeaders]);

  // Gestion des paramètres manquants
  const missingParam = paramNames.find(
    (name: string) => !params.find((p) => p.name === name)?.value
  );

  // Envoi de la requête (mock ou réelle)
  const onSend = async () => {
    if (missingParam) {
      setResponse(
        `Erreur : le paramètre « ${missingParam} » est requis dans l’URL.`
      );
      setHttpError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setResponse(null);
    setHttpError(null);
    setResponseTime(null);
    setResponseHeaders(null);
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
    // Simule une requête API
    try {
      const mockRes: MockApiResponse = {
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ success: true, params, parsedBody }),
      };
      await new Promise((r) => setTimeout(r, 500));
      setResponse(mockRes.body ? String(mockRes.body) : null);
      setResponseHeaders(mockRes.headers || null);
      setResponseTime(Math.round(performance.now() - start));
      setHistory((h) => [
        ...h,
        {
          req: { method, url: computedUrl, body: parsedBody },
          res: mockRes.body,
        },
      ]);
      // Synchronisation du contexte après création de widget
      const isWidgetPost = method === 'POST' && /\/widgets(\b|\/|$)/.test(url);
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
      setHttpError({ status: 500, statusText: 'Erreur', body: String(err) });
    } finally {
      setLoading(false);
    }
  };

  // Debug info
  const rawUrlProp = url;
  let urlWarning: string | null = null;
  if (computedUrl.startsWith('/')) {
    urlWarning =
      "L’URL utilisée est relative ('/…'). Vérifiez que TRIGGER_API_BASE_URL est bien défini.";
  } else if (
    /localhost(:\d+)?/.test(computedUrl) &&
    !/localhost:\d+/.test(computedUrl)
  ) {
    urlWarning =
      "L’URL utilisée contient 'localhost' sans port explicite. Ajoutez :3000 ou le port de votre serveur.";
  } else if (computedUrl.includes('undefined')) {
    urlWarning =
      "L’URL contient 'undefined' : vérifiez la config TRIGGER_API_BASE_URL.";
  }

  // Composant bouton cURL (exemple minimal)
  const CurlCopyButton = (props: any) => (
    <button
      style={{
        background: palette.accent2,
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '6px 16px',
        fontSize: 13,
        cursor: 'pointer',
        marginTop: 8,
      }}
      onClick={() => {
        const curl = `curl -X ${props.method} '${props.url}'`;
        navigator.clipboard.writeText(curl);
        alert('cURL copié !');
      }}
    >
      Copier cURL
    </button>
  );

  return (
    <div
      style={{
        border: `1px solid ${palette.border}`,
        borderRadius: 12,
        background: '#fff',
        // maxWidth: 700,
        margin: '0 auto',
        // padding: '24px',
        boxShadow: '0 2px 12px #0001',
        overflow: 'hidden',
      }}
    >
      <TriggerFunctionDebug
        showDebugInfo={showDebugInfo}
        showUrlDebug={showUrlDebug}
        rawUrlProp={rawUrlProp}
        computedUrl={computedUrl}
        urlWarning={urlWarning}
        palette={palette}
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
        customHeaders={customHeaders}
        setCustomHeaders={setCustomHeaders}
        isHeadersSynced={isHeadersSynced}
        useAuth={useAuth}
        setUseAuth={setUseAuth}
        onSend={onSend}
        loading={loading}
        hasNonSimpleCustomHeader={hasNonSimpleCustomHeader}
        palette={palette}
        t={t}
        effectiveHeaders={effectiveHeaders}
        computedUrl={computedUrl}
        method={method}
        CurlCopyButton={CurlCopyButton}
        label={label}
      />
      <TriggerFunctionResult
        response={response}
        httpError={httpError}
        responseTime={responseTime}
        responseHeaders={responseHeaders}
        palette={palette}
        t={t}
      />
      <TriggerFunctionHistory history={history} palette={palette} t={t} />
    </div>
  );
};

export default TriggerFunction;
