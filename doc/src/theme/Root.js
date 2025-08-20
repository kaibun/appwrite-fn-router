import React, { useLayoutEffect } from 'react';
import ensureAnchorSupport from '@src/utils/anchorPolyfill';

export default function Root({ children }) {
  useLayoutEffect(() => {
    ensureAnchorSupport();
  }, []);
  return <>{children}</>;
}
