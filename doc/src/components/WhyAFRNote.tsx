import Admonition from '@theme/Admonition';

import { useUIContext } from '@src/theme/UIContext';

export default function WhyAFRNote() {
  const { t } = useUIContext();
  return (
    <Admonition type="note" title={t.whyAFRTitle}>
      <p>{t.whyAFRIntro}</p>
      <ul>
        <li>
          <b>{t.whyAFRCustomLogicTitle}</b>: {t.whyAFRCustomLogicDesc}
        </li>
        <li>
          <b>{t.whyAFRValidationTitle}</b>: {t.whyAFRValidationDesc}
        </li>
        <li>
          <b>{t.whyAFRSecurityTitle}</b>: {t.whyAFRSecurityDesc}
        </li>
        <li>
          <b>{t.whyAFRIntegrationTitle}</b>: {t.whyAFRIntegrationDesc}
        </li>
        <li>
          <b>{t.whyAFRReusableTitle}</b>: {t.whyAFRReusableDesc}
        </li>
        <li>
          <b>{t.whyAFRInteroperabilityTitle}</b>: {t.whyAFRInteroperabilityDesc}
        </li>
        <li>
          <b>{t.whyAFRVersioningTitle}</b>: {t.whyAFRVersioningDesc}
        </li>
      </ul>
      <p>{t.whyAFRSummary}</p>
    </Admonition>
  );
}
