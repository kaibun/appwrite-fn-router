export const messages = {
  fr: {
    addAuth: 'Ajouter le header ',
    authValue: 'Authorization: Bearer foobar',
    customHeaders: 'Headers custom :',
    noCustomHeader: 'Aucun header custom',
    addHeader: '+ Ajouter un header',
    customHeaderWarning:
      '⚠️ Les headers personnalisés nécessitent d’être explicitement autorisés côté serveur pour fonctionner en CORS (Cross-Origin Resource Sharing) pour les requêtes complexes (du type POST, PATCH, etc.)',
    seeDoc: 'Consultez la documentation',
    mdnCors: 'MDN sur CORS',
    body: 'Body',
    bodyEditable: ' (JSON modifiable)',
    params: 'Paramètres :',
    buildHeaders: 'Headers à construire :',
    sentHeaders: 'Headers envoyés :',
    send: 'Envoi...',
    trigger: 'Trigger Function',
    httpError: 'Erreur HTTP :',
    bodyLabel: 'Body :',
    responseHeaders: 'Headers de la réponse HTTP',
    history: 'Historique (5 dernières requêtes)',
    response: 'Réponse :',
    removeHeader: 'Supprimer ce header',
    key: 'clé',
    value: 'valeur',
    invalidJson: 'Erreur : le body n’est pas un JSON valide.',
    httpErrorBody: 'Body :',
    showLines: 'Afficher lignes {start}-{end}',
    show: 'Afficher',
    fold: 'Replier',
    lines: 'lignes {start}-{end}',
    getWidgetDescription:
      'Cette étape permet de récupérer un widget par son ID. Si l’ID n’existe pas, une erreur 404 est retournée.',
    getWidgetDiffTitle: 'Ajouter GET /widgets/:id',
    getWidgetLabel: 'Récupérer un widget par ID',
    mainStepDescription:
      'Créez un fichier nommé main.ts contenant le code source de base pour votre fonction Appwrite :',
    mainStepFileTitle: 'Nouveau fichier main.ts',
    createWidgetDescription:
      'Cette étape ajoute un endpoint pour créer un widget à partir d’un objet poids et couleur. Le code ci-dessous effectue une validation simple et retourne le widget créé.',
    createWidgetDiffTitle: 'Ajouter POST /widgets',
    createWidgetLabel: 'Créer un widget',
    listWidgetsDiffTitle: 'Ajouter GET /widgets',
    listWidgetsLabel: 'Lister les widgets',
    nextStep: 'Étape suivante',
    goFurtherTitle: 'Aller plus loin',
    goFurtherIntro:
      'Vous avez maintenant une API REST fonctionnelle pour gérer des widgets. Pour aller plus loin, vous pouvez :',
    goFurtherPagination:
      'Ajouter des fonctionnalités avancées comme la pagination, le tri, la recherche… (souvent via des paramètres de requête)',
    goFurtherMiddlewares:
      'Intégrer des middlewares pour la sécurité (authentification, autorisation, CORS, etc.)',
    goFurtherTests:
      'Mettre en place des tests unitaires et d’intégration pour valider le comportement de votre API.',
    goFurtherDocs: 'Voir la ',
    goFurtherContribute:
      'Contribuez à la bibliothèque AFR en proposant des améliorations ou des corrections !',
    step1Title: 'Installer la bibliothèque',
    step2Title: 'Créer le routeur principal',
    step3Title: 'GET /widgets',
    step4Title: 'POST /widgets',
    step5Title: 'GET /widgets/:id',
    step6Title: 'PATCH /widgets/:id',
    step7Title: 'DELETE /widgets/:id',
    step8Title: 'POST /widgets/bulk',
    step9Title: 'DELETE /widgets/bulk',
    step10Title: 'Pour aller plus loin…',
    stepByStepSummary: 'Résumé étape par étape',
    stepByStepLabel: 'Étape par étape',
    patchWidgetDescription:
      'Cette étape permet de modifier un widget existant. Si l’ID n’existe pas, une erreur 404 est retournée. Le code ci-dessous met à jour le poids et la couleur du widget.',
    patchWidgetDiffTitle: 'Ajouter PATCH /widgets/:id',
    patchWidgetLabel: 'Modifier un widget',
    deleteWidgetDescription:
      'Cette étape permet de supprimer un widget existant par son ID. Si l’ID n’existe pas, une erreur 404 est retournée.',
    deleteWidgetDiffTitle: 'Ajouter DELETE /widgets/:id',
    deleteWidgetLabel: 'Supprimer un widget',
    bulkCreateWidgetsDescription:
      'Il est pleinement RESTful d’exposer un endpoint permettant la création en masse de ressources, tant que le groupe est bien identifié et géré en toute sécurité. Cela optimise les coûts et les performances (moins d’appels réseau, latence, facturation, etc.).',
    bulkCreateWidgetsDiffTitle: 'Ajouter bulk POST /widgets',
    bulkCreateWidgetsLabel: 'Créer des widgets en masse',
    deleteAllWidgetsDescription:
      'Attention, ce type d’opération est puissant et donc dangereux ! Il devrait probablement être réservé à des cas bien identifiés (admin, démo, etc.). Pour ce tutoriel, c’est très pratique ;)',
    deleteAllWidgetsDiffTitle: 'Ajouter bulk DELETE /widgets',
    deleteAllWidgetsLabel: 'Supprimer tous les widgets !',
    whyAFRTitle: 'Pourquoi créer votre propre API REST avec AFR ?',
    whyAFRIntro:
      'Appwrite expose déjà une API REST native pour accéder à ses collections. Cependant, créer votre propre API REST offre de nombreux avantages :',
    whyAFRCustomLogicTitle: 'Logique métier personnalisée',
    whyAFRCustomLogicDesc:
      'Ajoutez du traitement avant/après lecture/écriture (validation, enrichissement, calculs, etc.).',
    whyAFRValidationTitle: 'Validation avancée',
    whyAFRValidationDesc:
      'Contrôlez précisément les données entrantes/sortantes, gérez des cas métier complexes.',
    whyAFRSecurityTitle: 'Sécurité renforcée',
    whyAFRSecurityDesc:
      'Appliquez vos propres règles d’authentification, d’autorisation, de filtrage, etc.',
    whyAFRIntegrationTitle: 'Intégration avec des outils tiers',
    whyAFRIntegrationDesc:
      'Connectez facilement d’autres services (APIs externes, analytics, emails, etc.) dans vos endpoints.',
    whyAFRReusableTitle: 'API personnalisée et réutilisable',
    whyAFRReusableDesc:
      'Exposez uniquement les routes et formats utiles à vos clients (front, mobile, partenaires) ; masquez la structure interne d’Appwrite, découplant votre API d’Appwrite.',
    whyAFRInteroperabilityTitle: 'Interopérabilité',
    whyAFRInteroperabilityDesc:
      'Adaptez les conventions de votre API (RESTful, GraphQL, RPC…) à vos besoins ou à ceux de vos utilisateurs.',
    whyAFRVersioningTitle: 'Versioning et documentation',
    whyAFRVersioningDesc:
      'Contrôlez le cycle de vie, la documentation et l’évolution de votre API indépendamment du backend Appwrite.',
    whyAFRSummary:
      'En résumé, créer une couche API REST vous permet de transformer Appwrite en un backend véritablement programmable, adapté à vos besoins métier et aux standards d’API.',
    urlWarningRelative:
      "L’URL utilisée est relative ('/…'). Vérifiez que TRIGGER_API_BASE_URL est bien défini.",
    urlWarningLocalhostNoPort:
      "L’URL utilisée contient 'localhost' sans port explicite. Ajoutez :3000 ou le port de votre serveur.",
    urlWarningUndefined:
      "L’URL contient 'undefined' : vérifiez la config TRIGGER_API_BASE_URL.",
  },
  en: {
    addAuth: 'Add header ',
    authValue: 'Authorization: Bearer foobar',
    customHeaders: 'Custom headers',
    getWidgetDescription:
      'This step allows you to retrieve a widget by its ID. If the ID does not exist, a 404 error is returned.',
    getWidgetDiffTitle: 'Add GET /widgets/:id',
    getWidgetLabel: 'Get widget by ID',
    noCustomHeader: 'No custom header',
    addHeader: '+ Add header',
    customHeaderWarning:
      '⚠️ Custom headers must be explicitly allowed by the server to work with CORS (Cross-Origin Resource Sharing) for complex requests (like POST, PATCH, etc.)',
    seeDoc: 'See documentation',
    mdnCors: 'MDN about CORS',
    body: 'Body',
    bodyEditable: ' (editable JSON)',
    params: 'Parameters',
    buildHeaders: 'Build headers',
    sentHeaders: 'Sent headers',
    send: 'Sending...',
    trigger: 'Trigger Function',
    mainStepDescription:
      'Create a file named main.ts containing the base source code for your Appwrite function:',
    mainStepFileTitle: 'New file main.ts',
    httpError: 'HTTP error',
    bodyLabel: 'Body',
    responseHeaders: 'HTTP response headers',
    history: 'History (last 5 requests)',
    response: 'Response',
    removeHeader: 'Remove this header',
    key: 'key',
    value: 'value',
    invalidJson: 'Error: body is not valid JSON.',
    httpErrorBody: 'Body',
    showLines: 'Show lines {start}-{end}',
    show: 'Show',
    fold: 'Fold',
    lines: 'lines {start}-{end}',
    createWidgetDescription:
      'This step adds an endpoint to create a widget from a weight and color object. The code below performs simple validation and returns the created widget.',
    createWidgetDiffTitle: 'Add POST /widgets',
    createWidgetLabel: 'Create widget',
    listWidgetsDiffTitle: 'Add GET /widgets',
    listWidgetsLabel: 'List widgets',
    nextStep: 'Next step',
    goFurtherTitle: 'Go further',
    goFurtherIntro:
      'You now have a functional REST API to manage widgets. To go further, you can:',
    goFurtherPagination:
      'Add advanced features like pagination, sorting, search… (often using query parameters)',
    goFurtherMiddlewares:
      'Integrate middlewares for security (authentication, authorization, CORS, etc.)',
    goFurtherTests:
      'Set up unit and integration tests to validate your API behavior.',
    goFurtherDocs: 'Check out the ',
    goFurtherContribute:
      'Contribute to the AFR library by suggesting improvements or fixes!',
    step1Title: 'Install the library',
    step2Title: 'Create the main router',
    step3Title: 'GET /widgets',
    step4Title: 'POST /widgets',
    step5Title: 'GET /widgets/:id',
    step6Title: 'PATCH /widgets/:id',
    step7Title: 'DELETE /widgets/:id',
    step8Title: 'POST /widgets/bulk',
    step9Title: 'DELETE /widgets/bulk',
    step10Title: 'Go further',
    stepByStepSummary: 'Step-by-step summary',
    stepByStepLabel: 'Step by step',
    patchWidgetDescription:
      'This step allows you to update an existing widget. If the ID does not exist, a 404 error is returned. The code below updates the weight and color of the widget.',
    patchWidgetDiffTitle: 'Add PATCH /widgets/:id',
    patchWidgetLabel: 'Patch widget',
    deleteWidgetDescription:
      'This step allows you to delete an existing widget by its ID. If the ID does not exist, a 404 error is returned.',
    deleteWidgetDiffTitle: 'Add DELETE /widgets/:id',
    deleteWidgetLabel: 'Delete widget',
    bulkCreateWidgetsDescription:
      'It is fully RESTful to expose an endpoint allowing bulk creation of resources, as long as the group is well identified and safely handled. This optimizes costs and performance (fewer network calls, latency, billing, etc.).',
    bulkCreateWidgetsDiffTitle: 'Add bulk POST /widgets',
    bulkCreateWidgetsLabel: 'Create widgets in bulk',
    deleteAllWidgetsDescription:
      'Warning, this kind of operation is powerful and therefore dangerous! It should probably be reserved for well-identified cases (admin, demo, etc.). For this tutorial, it is very convenient ;)',
    deleteAllWidgetsDiffTitle: 'Add bulk DELETE /widgets',
    deleteAllWidgetsLabel: 'Delete all widgets!',
    whyAFRTitle: 'Why build your own REST API with AFR?',
    whyAFRIntro:
      'Appwrite already exposes a native REST API to access its collections. However, building your own REST API offers many advantages:',
    whyAFRCustomLogicTitle: 'Custom business logic',
    whyAFRCustomLogicDesc:
      'Add processing before/after read/write (validation, enrichment, calculations, etc.).',
    whyAFRValidationTitle: 'Advanced validation',
    whyAFRValidationDesc:
      'Control incoming/outgoing data precisely, handle complex business cases.',
    whyAFRSecurityTitle: 'Enhanced security',
    whyAFRSecurityDesc:
      'Apply your own authentication, authorization, filtering rules, etc.',
    whyAFRIntegrationTitle: 'Integration with third-party tools',
    whyAFRIntegrationDesc:
      'Easily connect other services (external APIs, analytics, emails, etc.) in your endpoints.',
    whyAFRReusableTitle: 'Custom and reusable API',
    whyAFRReusableDesc:
      'Expose only the routes and formats useful to your clients (front, mobile, partners); hide Appwrite’s internal structure, decoupling your API from Appwrite.',
    whyAFRInteroperabilityTitle: 'Interoperability',
    whyAFRInteroperabilityDesc:
      'Adapt your API conventions (RESTful, GraphQL, RPC…) to your needs or those of your users.',
    whyAFRVersioningTitle: 'Versioning and documentation',
    whyAFRVersioningDesc:
      'Control the lifecycle, documentation, and evolution of your API independently from the Appwrite backend.',
    whyAFRSummary:
      'In summary, building a REST API layer lets you turn Appwrite into a truly programmable backend, tailored to your business needs and API standards.',
    urlWarningRelative:
      "The URL used is relative ('/…'). Make sure TRIGGER_API_BASE_URL is set.",
    urlWarningLocalhostNoPort:
      "The URL contains 'localhost' without an explicit port. Add :3000 or your server port.",
    urlWarningUndefined:
      "The URL contains 'undefined': check your TRIGGER_API_BASE_URL config.",
  },
} as const;

export type Lang = keyof typeof messages;
export type LangMessages = (typeof messages)[Lang];
