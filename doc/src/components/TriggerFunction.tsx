import React, { useState } from 'react';
import { useTriggerFunctionSync } from './TriggerFunctionSyncContext';
import { useDocusaurusLocale } from './useDocusaurusLocale';
import { useDocusaurusColorMode } from './useDocusaurusColorMode';
import { getOrCreateWidgetUserId } from './useWidgetUserId';
import { CurlCopyButton } from './CurlCopyButton';

// Système i18n simple (fr/en)
const messages = {
  fr: {
    addAuth: 'Ajouter le header ',
    authValue: 'Authorization: Bearer foobar',
    customHeaders: 'Headers custom :',
    noCustomHeader: 'Aucun header custom',
    addHeader: '+ Ajouter un header',
    customHeaderWarning:
      '⚠️ Les headers custom nécessitent d’être explicitement autorisés côté serveur pour fonctionner en CORS (Cross-Origin Resource Sharing).',
    seeDoc: 'Consultez la documentation',
    mdnCors: 'MDN sur CORS',
    body: 'Body',
    bodyEditable: ' (JSON modifiable)',
    params: 'Paramètres :',
    sentHeaders: 'Headers envoyés :',
    send: 'Envoi...',
    trigger: 'Trigger Function',
    httpError: 'Erreur HTTP :',
    bodyLabel: 'Body :',
    responseHeaders: 'Headers de la réponse HTTP',
    history: 'Historique (5 dernières requêtes)',
    response: 'Réponse :',
    removeHeader: 'Supprimer ce header',
    key: 'Clé',
    value: 'Valeur',
    invalidJson: 'Erreur : le body n’est pas un JSON valide.',
    httpErrorBody: 'Body :',
  },
  en: {
    addAuth: 'Add header ',
    authValue: 'Authorization: Bearer foobar',
    customHeaders: 'Custom headers:',
    noCustomHeader: 'No custom header',
    addHeader: '+ Add header',
    customHeaderWarning:
      '⚠️ Custom headers must be explicitly allowed by the server to work with CORS (Cross-Origin Resource Sharing).',
    seeDoc: 'See documentation',
    mdnCors: 'MDN about CORS',
    body: 'Body',
    bodyEditable: ' (editable JSON)',
    params: 'Parameters:',
    sentHeaders: 'Sent headers:',
    send: 'Sending...',
    trigger: 'Trigger Function',
    httpError: 'HTTP error:',
    bodyLabel: 'Body:',
    responseHeaders: 'HTTP response headers',
    history: 'History (last 5 requests)',
    response: 'Response:',
    removeHeader: 'Remove this header',
    key: 'Key',
    value: 'Value',
    invalidJson: 'Error: body is not valid JSON.',
    httpErrorBody: 'Body:',
  },
} as const;

type Lang = keyof typeof messages;

interface Param {
  name: string;
  value: string;
}

interface MockApiResponse {
  status: number;
  statusText?: string;
  headers?: Record<string, string>;
  body?: any;
}

interface TriggerFunctionProps {
  method: string;
  url: string;
  body?: any;
  headers?: Record<string, string>;
  label?: string;
  urlParams?: string[]; // ex: ['id'] pour /widgets/:id
  step?: number; // Numéro d’étape (1, 2, 3, ...)
  // plus de stepType
  onStepDone?: (response: any) => void;
  showHttpError?: boolean; // Affiche le code et message d’erreur HTTP (par défaut true)
  /**
   * Affiche l’URL réellement utilisée et un warning si elle semble incorrecte (dev/debug)
   */
  showUrlDebug?: boolean;

  /**
   * Affiche le bloc debug (prop url, URL utilisée, warning)
   */
  showDebugInfo?: boolean;

  /**
   * Rend le body (textarea) en lecture seule
   */
  readOnlyBody?: boolean;

  /**
   * Si fourni, intercepte la requête et retourne une réponse mockée locale (aucune requête réseau)
   * Signature : (params: { method, url, body, headers }) => Promise<MockApiResponse> | MockApiResponse
   */
  mockApi?: (params: {
    method: string;
    url: string;
    body?: any;
    headers: Record<string, string>;
  }) => Promise<MockApiResponse> | MockApiResponse;
}

const defaultHeaders: Record<string, string> = {
  'Content-Type': 'application/json',
};

function extractParams(url: string): string[] {
  // Extrait les :param dans /widgets/:id mais ignore les ports (ex :3000)
  // On considère qu'un port est :<nombre> juste après 'localhost' ou un domaine
  // On ne veut pas matcher :3000 dans http://localhost:3000/widgets/:id
  const matches = url.match(/:([a-zA-Z_][a-zA-Z0-9_]*)/g); // n'accepte pas :<nombre> seul
  return matches ? matches.map((m) => m.slice(1)) : [];
}

const TriggerFunction: React.FC<TriggerFunctionProps> = ({
  method,
  url,
  body: initialBody,
  headers = {},
  label = 'Trigger Function',
  urlParams,
  step = 1,
  // plus de stepType
  onStepDone,
  showHttpError = true,
  showUrlDebug = true,
  showDebugInfo = true,
  readOnlyBody = false,
  mockApi,
}) => {
  if (
    typeof window !== 'undefined' &&
    window.location &&
    window.location.search.includes('debugStep=1')
  ) {
    // eslint-disable-next-line no-console
    console.log('[TriggerFunction props]', {
      method,
      url,
      body: initialBody,
      headers,
      label,
      urlParams,
      step,
      // plus de stepType
      onStepDone,
      showHttpError,
      showUrlDebug,
      showDebugInfo,
      readOnlyBody,
      mockApi,
    });
  }

  // Synchronisation d’id de widget entre exemples
  let sync: ReturnType<typeof useTriggerFunctionSync> | undefined = undefined;
  try {
    sync = useTriggerFunctionSync();
  } catch {}

  // ID utilisateur persistant (localStorage)
  const [widgetUserId] = useState(() =>
    typeof window !== 'undefined' ? getOrCreateWidgetUserId() : ''
  );
  // Langue UI (Docusaurus ou fallback)
  const lang = useDocusaurusLocale() as Lang;
  const t = messages[lang] || messages.fr;
  // Color mode (light/dark)
  const colorMode = useDocusaurusColorMode();

  // Gestion des paramètres dynamiques de l’URL
  const paramNames = urlParams || extractParams(url);

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

  // Erreur de parsing JSON live
  const [bodyJsonError, setBodyJsonError] = useState<string | null>(null);

  // Headers custom dynamiques (clé/valeur), synchronisés si disponibles
  const [customHeaders, setCustomHeaders] = useState<
    { key: string; value: string }[]
  >(
    headers && Object.keys(headers).length > 0
      ? Object.entries(headers).map(([key, value]) => ({ key, value }))
      : isHeadersSynced
        ? Object.entries(sync?.lastWidgetHeaders ?? {}).map(([key, value]) => ({
            key,
            value,
          }))
        : []
  );

  // Détection de headers custom non "CORS-safelisted"
  const isCorsSimpleHeader = (key: string, value: string) => {
    // https://fetch.spec.whatwg.org/#cors-safelisted-request-header
    const k = key.trim().toLowerCase();
    if (k === 'accept' || k === 'accept-language' || k === 'content-language')
      return true;
    if (k === 'content-type') {
      const v = value.trim().toLowerCase();
      return (
        v === 'application/x-www-form-urlencoded' ||
        v === 'multipart/form-data' ||
        v === 'text/plain'
      );
    }
    return false;
  };
  const hasNonSimpleCustomHeader = customHeaders.some(
    (h) => h.key && !isCorsSimpleHeader(h.key, h.value)
  );

  // Debug : affiche la liste des paramètres extraits
  if (showUrlDebug) {
    // eslint-disable-next-line no-console
    console.log('[TriggerFunction] paramNames extraits :', paramNames);
  }

  // Si un id synchronisé existe, pré-remplit le param id
  const [params, setParams] = useState<Param[]>(
    paramNames.map((name) => {
      if (name === 'id' && sync?.lastWidgetId) {
        return { name, value: sync.lastWidgetId };
      }
      return { name, value: '' };
    })
  );

  // Si l’id partagé change (création d’un widget), met à jour le champ id si présent

  const [useAuth, setUseAuth] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [httpError, setHttpError] = useState<{
    status: number;
    // Pour debug : garder la prop url brute
    statusText: string;
    body?: string;
  } | null>(null);
  // Temps de réponse (ms)
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<{ req: any; res: any }[]>([]);
  // Pour debug : garder la prop url brute
  const rawUrlProp = url;

  // Remplace les :param dans l’URL par leur valeur
  const computedUrl = paramNames.reduce((acc, name) => {
    if (showUrlDebug) {
      // eslint-disable-next-line no-console
      console.log('[TriggerFunction] url prop :', rawUrlProp);
      // eslint-disable-next-line no-console
      console.log('[TriggerFunction] url courante (reduce) :', acc);
    }
    const val = params.find((p) => p.name === name)?.value || '';
    return acc.replace(`:${name}`, val);
  }, url);

  // Détection d’URL potentiellement incorrecte
  let urlWarning: string | null = null;
  if (showUrlDebug) {
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
  }

  // Vérifie que tous les paramètres dynamiques sont remplis
  const missingParam = paramNames.find(
    (name) => !params.find((p) => p.name === name)?.value
  );

  const sendRequest = async () => {
    // Si un paramètre dynamique est manquant, affiche une erreur et bloque l’envoi
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
    setResponseHeaders(null);
    setResponseTime(null);

    let parsedBody: any = undefined;
    try {
      parsedBody = body ? JSON.parse(body) : undefined;
    } catch (e) {
      setResponse(t.invalidJson);
      setLoading(false);
      return;
    }

    // Si c’est un POST /widgets qui retourne un id, synchronise-le
    const isWidgetPost = method === 'POST' && /\/widgets(\b|\/|$)/.test(url);

    // Si mockApi est fourni, intercepter ici
    if (mockApi) {
      const t0 = performance.now();
      try {
        const mockRes = await mockApi({
          method,
          url: computedUrl,
          body: parsedBody,
          headers: effectiveHeaders,
        });
        const t1 = performance.now();
        setResponseTime(Math.round(t1 - t0));
        // Simule l’API fetch
        const status = mockRes.status;
        const statusText = mockRes.statusText || '';
        const headersObj = mockRes.headers || {};
        setResponseHeaders(headersObj);
        let text = mockRes.body;
        if (typeof text === 'object') {
          text = JSON.stringify(text, null, 2);
        } else if (typeof text !== 'string') {
          text = String(text);
        }
        if (showHttpError && status >= 400) {
          setHttpError({
            status,
            statusText,
            body: text,
          });
        } else {
          setHttpError(null);
        }
        setResponse(text);
        setHistory((h) => [
          {
            req: {
              method,
              url: computedUrl,
              body: parsedBody,
              headers: effectiveHeaders,
            },
            res: text,
          },
          ...h.slice(0, 4),
        ]);
        // Progression automatique : onStepDone appelé en cas de succès
        if (status < 400 && onStepDone) {
          onStepDone(text);
        }
      } catch (e: any) {
        setResponse('Erreur mock: ' + (e?.message || e));
      }
      setLoading(false);
      return;
    }

    // Sinon, requête réseau réelle
    try {
      const t0 = performance.now();
      const res = await fetch(computedUrl, {
        method,
        headers: effectiveHeaders,
        body:
          parsedBody && method !== 'GET'
            ? JSON.stringify(parsedBody)
            : undefined,
      });
      const t1 = performance.now();
      setResponseTime(Math.round(t1 - t0));
      // Récupère les headers de la réponse
      const headersObj: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headersObj[key] = value;
      });
      setResponseHeaders(headersObj);

      const contentType = res.headers.get('content-type') || '';
      let text = await res.text();
      if (contentType.includes('application/json')) {
        try {
          text = JSON.stringify(JSON.parse(text), null, 2);
        } catch {}
      }
      if (showHttpError && res.status >= 400) {
        setHttpError({
          status: res.status,
          statusText: res.statusText,
          body: text,
        });
      } else {
        setHttpError(null);
      }
      setResponse(text);
      setHistory((h) => [
        {
          req: {
            method,
            url: computedUrl,
            body: parsedBody,
            headers: effectiveHeaders,
          },
          res: text,
        },
        ...h.slice(0, 4),
      ]);
      // Synchronise l’id, le body et les headers custom si possible
      if (isWidgetPost && sync) {
        try {
          const data = JSON.parse(text);
          if (data && typeof data.id === 'string') {
            sync.setLastWidgetId(data.id);
            sync.setLastWidgetBody(parsedBody);
            // On ne synchronise que les headers custom (pas les headers par défaut ni auth)
            const custom = customHeaders.filter((h) => h.key);
            const customObj = Object.fromEntries(
              custom.map((h) => [h.key, h.value])
            );
            sync.setLastWidgetHeaders(customObj);
          }
        } catch {}
      }
      // Progression automatique : onStepDone appelé en cas de succès
      if (res.status < 400 && onStepDone) {
        onStepDone(text);
      }
    } catch (e: any) {
      setResponse('Erreur: ' + (e?.message || e));
    }
    setLoading(false);
  };

  // Headers envoyés, calculés dynamiquement à chaque rendu
  const effectiveHeaders: Record<string, string> = {
    ...defaultHeaders,
    ...headers,
    ...(useAuth ? { Authorization: 'Bearer foobar' } : {}),
    ...Object.fromEntries(
      customHeaders.filter((h) => h.key).map((h) => [h.key, h.value])
    ),
    ...(widgetUserId ? { 'X-Widget-User-Id': widgetUserId } : {}),
  };

  // Headers de la réponse HTTP
  const [responseHeaders, setResponseHeaders] = useState<Record<
    string,
    string
  > | null>(null);

  // Détection de synchronisation globale (id, body, headers)
  const isAnySync =
    !!sync?.lastWidgetId || !!sync?.lastWidgetBody || !!sync?.lastWidgetHeaders;

  // Palette dynamique
  const palette =
    colorMode === 'dark'
      ? {
          border: '#26324a',
          bg: 'linear-gradient(90deg, #181e29 0%, #232b3a 100%)',
          shadow: '0 4px 16px 0 rgba(30,40,60,0.18)',
          text: '#eaf2ff',
          subtext: '#b3bedc',
          accent: '#3b82f6',
          accent2: '#06b6d4',
          syncBg: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)',
          syncText: '#fff',
          syncOutline: '#3b82f6',
          inputBg: '#232b3a',
          inputBorder: '#3b82f6',
          inputText: '#eaf2ff',
          errorBg: '#2a1a1a',
          errorText: '#ffb3b3',
        }
      : {
          border: '#e0e6f0',
          bg: 'linear-gradient(90deg, #fafdff 0%, #f3f7fa 100%)',
          shadow: '0 4px 16px 0 rgba(60, 80, 120, 0.07)',
          text: '#222',
          subtext: '#555',
          accent: '#3b82f6',
          accent2: '#06b6d4',
          syncBg: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 100%)',
          syncText: '#fff',
          syncOutline: '#3b82f6',
          inputBg: '#fff',
          inputBorder: '#3b82f6',
          inputText: '#222',
          errorBg: '#ffeaea',
          errorText: '#a00',
        };

  // Rendu principal
  // Rendu principal (sans aucune logique step-by-step)
  return (
    <div
      style={{
        margin: '1.5em 0',
        border: `1.5px solid ${palette.border}`,
        borderRadius: 12,
        padding: 0,
        background: palette.bg,
        boxShadow: palette.shadow,
        fontFamily: 'inherit',
        position: 'relative',
        overflow: 'visible',
        color: palette.text,
      }}
    >
      {/* ZONE DEBUG/URL */}
      <div
        style={{
          padding: '18px 24px 0 24px',
          borderBottom: `1px solid ${palette.border}`,
          background: 'none',
        }}
      >
        {showDebugInfo && (
          <div
            style={{ fontSize: 13, color: palette.subtext, marginBottom: 4 }}
          >
            <span>
              Prop <code>url</code> : <code>{String(rawUrlProp)}</code>
            </span>
            <br />
            <span>
              URL utilisée : <code>{computedUrl}</code>
            </span>
            {urlWarning && (
              <>
                <br />
                <span
                  style={{ color: palette.errorText, fontWeight: 500 }}
                  role="alert"
                >
                  ⚠️ {urlWarning}
                </span>
              </>
            )}
          </div>
        )}
        <strong>{method}</strong> {computedUrl}
      </div>

      {/* ZONE PRÉPARATION REQUÊTE */}
      <div
        style={{
          padding: '18px 24px',
          borderBottom: `1px solid ${palette.border}`,
          background: 'none',
        }}
      >
        {/* Params */}
        {paramNames.length > 0 && (
          <fieldset style={{ margin: '8px 0 18px 0', border: 0, padding: 0 }}>
            <legend
              style={{
                fontSize: 13,
                marginBottom: 4,
                color: palette.subtext,
              }}
            >
              {t.params}
            </legend>
            <div style={{ display: 'flex', gap: 16 }}>
              {paramNames.map((name, idx) => {
                const inputId = `param-${name}-${idx}`;
                const isIdSynced =
                  name === 'id' &&
                  sync?.lastWidgetId &&
                  params.find((p) => p.name === name)?.value ===
                    sync.lastWidgetId;
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
                    <span style={{ fontSize: 13, marginRight: 4 }}>
                      {name}:
                    </span>
                    <input
                      id={inputId}
                      type="text"
                      value={params.find((p) => p.name === name)?.value || ''}
                      onChange={(e) =>
                        setParams((ps) =>
                          ps.map((p) =>
                            p.name === name
                              ? { ...p, value: e.target.value }
                              : p
                          )
                        )
                      }
                      style={{
                        marginLeft: 0,
                        width: 120,
                        background: isIdSynced ? '#e0f7fa' : palette.inputBg,
                        border: `1.5px solid ${isIdSynced ? '#00bcd4' : palette.inputBorder}`,
                        borderRadius: 6,
                        fontWeight: isIdSynced ? 600 : 400,
                        color: isIdSynced ? '#00796b' : palette.inputText,
                        fontSize: 14,
                        padding: '4px 8px',
                        transition: 'background 0.2s, border 0.2s',
                      }}
                      aria-label={name}
                    />
                    {isIdSynced && (
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
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 20 20"
                          fill="none"
                          style={{ marginRight: 2 }}
                        >
                          <circle cx="10" cy="10" r="10" fill="#fff" />
                          <path
                            d="M6 10a4 4 0 1 1 4 4"
                            stroke="#00bcd4"
                            strokeWidth="2"
                          />
                          <path
                            d="M10 14v2m0 0h2m-2 0h-2"
                            stroke="#00bcd4"
                            strokeWidth="2"
                          />
                        </svg>
                        SYNC
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </fieldset>
        )}
        {/* Auth toggle */}
        <div style={{ marginBottom: 12 }}>
          <label
            htmlFor="auth-toggle"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}
          >
            <input
              id="auth-toggle"
              type="checkbox"
              checked={useAuth}
              onChange={() => setUseAuth((v) => !v)}
              style={{ marginRight: 4 }}
              aria-checked={useAuth}
              aria-label={t.addAuth + t.authValue}
            />
            {t.addAuth}
            <code>{t.authValue}</code>
          </label>
        </div>
        {/* Custom headers */}
        <div style={{ marginBottom: 18 }}>
          <label
            style={{
              fontSize: 13,
              marginBottom: 4,
              display: 'block',
              color: palette.subtext,
            }}
          >
            {t.customHeaders}
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {customHeaders.length === 0 && (
              <div
                style={{
                  fontSize: 13,
                  color: palette.subtext,
                  marginBottom: 4,
                }}
              >
                {t.noCustomHeader}
              </div>
            )}
            {customHeaders.map((h, idx) => {
              const keyId = `custom-header-key-${idx}`;
              const valueId = `custom-header-value-${idx}`;
              const isHeaderSynced =
                isHeadersSynced &&
                sync?.lastWidgetHeaders &&
                h.key &&
                sync.lastWidgetHeaders[h.key] === h.value;
              return (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: isHeaderSynced ? '#e0f7fa' : palette.inputBg,
                    borderRadius: isHeaderSynced ? 8 : 6,
                    border: `1.5px solid ${isHeaderSynced ? '#00bcd4' : palette.inputBorder}`,
                    boxShadow: isHeaderSynced
                      ? '0 1px 4px #00bcd455'
                      : undefined,
                    position: 'relative',
                    padding: '2px 0',
                    marginBottom: 2,
                  }}
                >
                  <input
                    id={keyId}
                    type="text"
                    placeholder={t.key}
                    value={h.key}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCustomHeaders((chs) =>
                        chs.map((c, i) => (i === idx ? { ...c, key: v } : c))
                      );
                    }}
                    style={{
                      width: 120,
                      marginRight: 6,
                      fontSize: 13,
                      fontWeight: isHeaderSynced ? 600 : 400,
                      color: isHeaderSynced ? '#00796b' : palette.inputText,
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      padding: '4px 8px',
                    }}
                    aria-label={`${t.key} ${idx + 1}`}
                  />
                  <span style={{ margin: '0 4px', color: palette.subtext }}>
                    :
                  </span>
                  <input
                    id={valueId}
                    type="text"
                    placeholder={t.value}
                    value={h.value}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCustomHeaders((chs) =>
                        chs.map((c, i) => (i === idx ? { ...c, value: v } : c))
                      );
                    }}
                    style={{
                      width: 180,
                      marginRight: 6,
                      fontSize: 13,
                      fontWeight: isHeaderSynced ? 600 : 400,
                      color: isHeaderSynced ? '#00796b' : palette.inputText,
                      background: 'none',
                      border: 'none',
                      outline: 'none',
                      padding: '4px 8px',
                    }}
                    aria-label={`${t.value} ${idx + 1}`}
                  />
                  {isHeaderSynced && (
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
                      title="Header synchronisé avec la dernière création"
                    >
                      SYNC
                    </span>
                  )}
                  <button
                    type="button"
                    aria-label={t.removeHeader + ` ${idx + 1}`}
                    onClick={() =>
                      setCustomHeaders((chs) => chs.filter((_, i) => i !== idx))
                    }
                    style={{
                      fontSize: 13,
                      color: palette.errorText,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '2px 6px',
                    }}
                    title={t.removeHeader}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
            <button
              type="button"
              onClick={() =>
                setCustomHeaders((chs) => [...chs, { key: '', value: '' }])
              }
              style={{
                fontSize: 13,
                marginTop: 2,
                background: palette.inputBg,
                border: `1px solid ${palette.inputBorder}`,
                borderRadius: 6,
                padding: '2px 12px',
                cursor: 'pointer',
                color: palette.accent,
                fontWeight: 600,
              }}
            >
              {t.addHeader}
            </button>
            {hasNonSimpleCustomHeader && (
              <div
                style={{
                  fontSize: 12,
                  color: palette.errorText,
                  marginTop: 8,
                  maxWidth: 480,
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
            )}
          </div>
        </div>
        {/* Body */}
        {method !== 'GET' && (
          <details open style={{ marginBottom: 8 }}>
            <summary
              style={{
                cursor: 'pointer',
                fontSize: 13,
                marginBottom: 2,
                color: palette.subtext,
              }}
            >
              {t.body}
              {readOnlyBody ? '' : t.bodyEditable}
            </summary>
            <div>
              {readOnlyBody ? (
                <pre
                  style={{
                    background: isBodySynced ? '#e0f7fa' : palette.inputBg,
                    fontFamily: 'monospace',
                    fontSize: 14,
                    borderRadius: 6,
                    border: isBodySynced
                      ? '2px solid #00bcd4'
                      : `1.5px solid ${palette.inputBorder}`,
                    padding: 8,
                    marginTop: 4,
                    color: palette.inputText,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    position: 'relative',
                  }}
                >
                  <code>{body}</code>
                  {isBodySynced && (
                    <span
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        background: '#00bcd4',
                        color: '#fff',
                        borderRadius: 12,
                        padding: '2px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        boxShadow: '0 1px 4px #00bcd455',
                        letterSpacing: 0.5,
                      }}
                      title="Body synchronisé avec la dernière création"
                    >
                      SYNC
                    </span>
                  )}
                </pre>
              ) : (
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    rows={6}
                    style={{
                      width: '100%',
                      fontFamily: 'monospace',
                      fontSize: 14,
                      borderRadius: 6,
                      border: isBodySynced
                        ? '2px solid #00bcd4'
                        : `1.5px solid ${palette.inputBorder}`,
                      background: isBodySynced ? '#e0f7fa' : palette.inputBg,
                      padding: 8,
                      marginTop: 4,
                      color: palette.inputText,
                      fontWeight: isBodySynced ? 600 : 400,
                      transition: 'background 0.2s, border 0.2s',
                    }}
                  />
                  {isBodySynced && (
                    <span
                      style={{
                        position: 'absolute',
                        right: 12,
                        top: 10,
                        background: '#00bcd4',
                        color: '#fff',
                        borderRadius: 12,
                        padding: '2px 10px',
                        fontSize: 11,
                        fontWeight: 700,
                        boxShadow: '0 1px 4px #00bcd455',
                        letterSpacing: 0.5,
                      }}
                      title="Body synchronisé avec la dernière création"
                    >
                      SYNC
                    </span>
                  )}
                </div>
              )}
            </div>
          </details>
        )}
        {/* Headers envoyés + bouton cURL */}
        <div
          style={{
            marginBottom: 8,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
          }}
        >
          <div style={{ flex: 1 }}>
            <label
              style={{
                display: 'block',
                fontSize: 13,
                marginBottom: 2,
                color: palette.subtext,
              }}
            >
              {t.sentHeaders}
            </label>
            <pre
              style={{
                background: palette.inputBg,
                padding: 8,
                borderRadius: 6,
                fontSize: 13,
                margin: 0,
                overflowX: 'auto',
                color: palette.inputText,
              }}
            >
              {JSON.stringify(effectiveHeaders, null, 2)}
            </pre>
          </div>

          <CurlCopyButton
            method={method}
            url={computedUrl}
            headers={effectiveHeaders}
            body={body}
            palette={palette}
          />
        </div>

        {/* Bouton d’envoi */}
        <button
          onClick={sendRequest}
          disabled={loading || !!missingParam || !!bodyJsonError}
          style={{
            marginBottom: 8,
            marginTop: 8,
            background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.accent2} 100%)`,
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            fontWeight: 700,
            fontSize: 15,
            padding: '10px 32px',
            boxShadow: '0 2px 8px 0 rgba(59,130,246,0.10)',
            cursor:
              loading || !!missingParam || !!bodyJsonError
                ? 'not-allowed'
                : 'pointer',
            opacity: loading || !!missingParam || !!bodyJsonError ? 0.6 : 1,
            transition: 'background 0.2s, opacity 0.2s',
            outline: 'none',
          }}
          aria-busy={loading}
          aria-label={label}
          title={
            missingParam
              ? `Le paramètre « ${missingParam} » est requis`
              : bodyJsonError
                ? bodyJsonError
                : ''
          }
        >
          {loading ? t.send : label}
        </button>
        {bodyJsonError && (
          <div
            style={{ color: palette.errorText, fontSize: 13, marginTop: 4 }}
            role="alert"
          >
            ⚠️ {bodyJsonError}
          </div>
        )}
        {missingParam && (
          <div
            style={{ color: palette.errorText, fontSize: 13, marginTop: 4 }}
            role="alert"
          >
            ⚠️ Le paramètre <b>{missingParam}</b> est requis pour compléter
            l’URL.
          </div>
        )}
      </div>

      {/* ZONE RÉPONSE HTTP */}
      <div
        style={{
          padding: '18px 24px',
          background: 'none',
        }}
      >
        {/* Temps de réponse */}
        {responseTime !== null && (
          <div
            style={{ fontSize: 13, color: palette.subtext, marginBottom: 4 }}
          >
            ⏱️ Temps de réponse : <b>{responseTime} ms</b>
          </div>
        )}
        {showHttpError && httpError && (
          <div
            role="alert"
            aria-live="assertive"
            style={{
              background: palette.errorBg,
              color: palette.errorText,
              border: `1px solid ${palette.errorText}`,
              borderRadius: 6,
              padding: 12,
              marginTop: 8,
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            {t.httpError} <b>{httpError.status}</b> {httpError.statusText}
            {httpError.body && (
              <>
                <br />
                <span style={{ fontWeight: 400, fontSize: 13 }}>
                  {t.httpErrorBody}
                </span>
                <pre
                  style={{
                    background: palette.inputBg,
                    padding: 8,
                    borderRadius: 6,
                    margin: 0,
                    color: palette.inputText,
                  }}
                >
                  {httpError.body}
                </pre>
              </>
            )}
          </div>
        )}
        {response && (
          <CollapsibleResponseBody response={response} palette={palette} />
        )}
        {/* Affichage des headers de la réponse HTTP */}
        {responseHeaders && Object.keys(responseHeaders).length > 0 && (
          <details style={{ marginTop: 8 }}>
            <summary
              style={{
                cursor: 'pointer',
                fontSize: 13,
                color: palette.subtext,
              }}
            >
              Headers de la réponse HTTP
            </summary>
            <pre
              style={{
                background: palette.inputBg,
                padding: 8,
                borderRadius: 6,
                fontSize: 13,
                margin: 0,
                overflowX: 'auto',
                color: palette.inputText,
              }}
            >
              {JSON.stringify(responseHeaders, null, 2)}
            </pre>
          </details>
        )}
        {history.length > 0 && (
          <details style={{ marginTop: 12 }}>
            <summary style={{ cursor: 'pointer', color: palette.subtext }}>
              Historique (5 dernières requêtes)
            </summary>
            <ol style={{ fontSize: 13 }}>
              {history.map((h, i) => (
                <li key={i} style={{ marginBottom: 8 }}>
                  <div>
                    <b>{h.req.method}</b> {h.req.url}
                  </div>
                  {h.req.body && (
                    <div>
                      Body: <code>{JSON.stringify(h.req.body)}</code>
                    </div>
                  )}
                  <div>
                    Headers: <code>{JSON.stringify(h.req.headers)}</code>
                  </div>
                  <div>
                    Réponse :{' '}
                    <pre
                      style={{
                        display: 'inline',
                        background: palette.inputBg,
                        color: palette.inputText,
                      }}
                    >
                      {h.res}
                    </pre>
                  </div>
                </li>
              ))}
            </ol>
          </details>
        )}
      </div>
    </div>
  );
};

// Affichage collapsible du body JSON de la réponse
function CollapsibleResponseBody(props: { response: string; palette: any }) {
  const { response, palette } = props;
  // Replié par défaut si le body est long (>400 caractères)
  const defaultCollapsed = response.length > 400;
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed);
  // Détecte si c’est du JSON (pour afficher le bouton)
  let isJson = false;
  try {
    JSON.parse(response);
    isJson = true;
  } catch {}
  return (
    <div style={{ position: 'relative', marginTop: 8 }}>
      {isJson && (
        <button
          type="button"
          onClick={() => setCollapsed((v: boolean) => !v)}
          style={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 2,
            background: palette.inputBg,
            color: palette.accent,
            border: `1px solid ${palette.inputBorder}`,
            borderRadius: 6,
            fontSize: 13,
            padding: '2px 10px',
            cursor: 'pointer',
            fontWeight: 600,
            boxShadow: '0 1px 4px #3b82f655',
          }}
          aria-label={collapsed ? 'Déplier le body' : 'Replier le body'}
        >
          {collapsed ? 'Déplier' : 'Replier'} le body
        </button>
      )}
      <pre
        style={{
          background: palette.inputBg,
          padding: 12,
          borderRadius: 6,
          maxHeight: collapsed ? 48 : 300,
          overflow: 'auto',
          color: palette.inputText,
          margin: 0,
          filter: collapsed ? 'blur(2px)' : 'none',
          transition: 'max-height 0.2s, filter 0.2s',
        }}
        aria-live="polite"
        aria-expanded={!collapsed}
      >
        <code>{response}</code>
      </pre>
    </div>
  );
}

export default TriggerFunction;
