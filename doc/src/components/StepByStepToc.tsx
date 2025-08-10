import React from 'react';
import { useStep, useStepMode } from './StepProvider';

// À personnaliser selon les titres réels du tutoriel
const steps = [
  '1. Installer la librairie',
  '2. Créer le routeur principal',
  '3. Ajouter une route GET pour lister les widgets',
  '4. Ajouter une route POST pour créer un widget',
  '5. Ajouter une route GET pour récupérer un widget par ID',
  '6. Ajouter une route PATCH pour mettre à jour un widget',
  '7. Ajouter une route DELETE pour supprimer un widget',
  '8. Ajouter un endpoint POST /widgets pour la création groupée (bulk)',
  '9. Ajouter un endpoint DELETE /widgets pour tout supprimer (purge)',
  '10. Aller plus loin',
];

const StepByStepToc: React.FC = () => {
  const { currentStep, goToStep } = useStep();
  const { stepByStep, setStepByStep } = useStepMode();

  // Affichage du sommaire dynamique
  return (
    <aside
      style={{
        position: 'fixed',
        top: 100,
        right: 32,
        width: 320,
        background: '#fff',
        border: '1px solid #e0e6f0',
        borderRadius: 12,
        boxShadow: '0 4px 16px 0 rgba(60, 80, 120, 0.07)',
        padding: '24px 24px 16px 24px',
        zIndex: 100,
        maxHeight: '80vh',
        overflowY: 'auto',
      }}
      aria-label="Sommaire pas à pas"
    >
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <input
          type="checkbox"
          checked={stepByStep}
          onChange={(e) => setStepByStep(e.target.checked)}
          id="stepbystep-toggle"
          style={{ marginRight: 8 }}
        />
        <label
          htmlFor="stepbystep-toggle"
          style={{ fontWeight: 600, fontSize: 16 }}
        >
          Pas à pas
        </label>
      </div>
      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {steps.map((title, idx) => {
          const stepNum = idx + 1;
          const unlocked = stepByStep ? currentStep >= stepNum : true;
          return (
            <li
              key={stepNum}
              style={{
                marginBottom: 10,
                opacity: unlocked ? 1 : 0.5,
                cursor: unlocked ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
              }}
              onClick={() => {
                if (!unlocked) return;
                goToStep(stepNum);
                // Scroll vers l’étape correspondante
                setTimeout(() => {
                  const el = document.getElementById(`step-anchor-${stepNum}`);
                  if (el) {
                    // scrollIntoView avec scroll-margin-top fonctionne sur la plupart des navigateurs modernes
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Fallback pour Safari/iOS ou si scroll-margin-top n'est pas pris en compte
                    const headerHeight = 80; // Ajustez si besoin
                    const rect = el.getBoundingClientRect();
                    const absoluteY = window.scrollY + rect.top;
                    if (Math.abs(rect.top) < 5) {
                      // Si déjà bien positionné, ne rien faire
                      return;
                    }
                    window.scrollTo({
                      top: absoluteY - headerHeight,
                      behavior: 'smooth',
                    });
                  }
                }, 50);
              }}
              aria-current={currentStep === stepNum ? 'step' : undefined}
            >
              <span
                style={{
                  minWidth: 28,
                  minHeight: 28,
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: currentStep >= stepNum ? '#3b82f6' : '#e0e6f0',
                  color: currentStep >= stepNum ? '#fff' : '#888',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  marginRight: 10,
                  fontSize: 16,
                  boxSizing: 'border-box',
                  transition: 'background 0.2s',
                }}
                aria-hidden="true"
              >
                {currentStep > stepNum ? '✓' : stepNum}
              </span>
              <span style={{ fontWeight: currentStep === stepNum ? 700 : 400 }}>
                {title}
              </span>
            </li>
          );
          // Ajoute un anchor id sur chaque Step pour le scroll
        })}
      </ol>
    </aside>
  );
};

export default StepByStepToc;
