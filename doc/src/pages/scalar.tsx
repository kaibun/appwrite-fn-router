import BrowserOnly from '@docusaurus/BrowserOnly';
import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import { ApiReferenceReact } from '@scalar/api-reference-react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';

/**
 * A simple loading spinner component that adapts to the current color theme.
 */
function Spinner() {
  const { colorMode } = useColorMode();
  const spinnerColor = colorMode === 'dark' ? '#FFF' : '#000';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100vh - 60px)', // Matches the container height
      }}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
      <div
        style={{
          border: `4px solid ${spinnerColor}33`, // Transparent border
          borderTop: `4px solid ${spinnerColor}`, // Opaque top border
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite',
        }}
      />
    </div>
  );
}

/**
 * Renders the Scalar API Reference component with a delay to prevent SSR hydration issues.
 * This component ensures that it is only rendered on the client-side, after Docusaurus has
 * fully initialized its theme.
 * - `isMounted`: A state to track client-side mounting.
 * - `useEffect` with `setTimeout`: Delays rendering to avoid a race condition with the
 *   asynchronous initialization of Docusaurus' theme and `colorMode`.
 * - `useColorMode`: Safely used after mounting to pass the current theme to Scalar.
 */
function DelayedScalar() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Delay the update to ensure Docusaurus has finished its initialization.
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100); // A 100ms delay to be safe.

    return () => clearTimeout(timer); // Cleanup the timer.
  }, []);

  // Now that the component is mounted, we can safely use hooks.
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { i18n } = useDocusaurusContext();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { colorMode } = useColorMode();

  // Manually sync the body class with the current theme.
  // This is a workaround for a Docusaurus issue where the body class
  // is not always updated on custom pages.
  useEffect(() => {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${colorMode}-mode`);
  }, [colorMode]);

  // Render a spinner until the component is mounted.
  if (!isMounted) {
    return <Spinner />;
  }

  const config = {
    theme: colorMode === 'dark' ? ('alternate' as const) : ('default' as const),
    proxyUrl: 'https://proxy.scalar.com',
    url:
      process.env.NODE_ENV === 'production'
        ? 'https://raw.githubusercontent.com/kaibun/appwrite-fn-router/refs/heads/docusaurus-scalar/openapi/tsp-output/schema/openapi.0.1.0.yaml'
        : `/${i18n.currentLocale}/openapi.yaml`,
  };

  return (
    <div
      style={{
        height: 'calc(100vh - 60px)',
        width: '100%',
      }}
    >
      <ApiReferenceReact configuration={config} />
    </div>
  );
}

function ScalarPage() {
  return (
    <Layout title="Scalar API Reference" noFooter>
      <BrowserOnly>{() => <DelayedScalar />}</BrowserOnly>
    </Layout>
  );
}

export default ScalarPage;
