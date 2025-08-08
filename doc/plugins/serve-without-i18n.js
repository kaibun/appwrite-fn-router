const path = require('path');

module.exports = function serveWithoutI18N(context) {
  const { i18n } = context;

  console.log('------ Serve without i18n plugin initialized ------');

  return {
    name: 'docusaurus-plugin-serve-without-i18n',
    configureServer(app) {
      // Serves the openapi.yaml file at the root
      // app.get('/openapi.yaml', (req, res) => {
      //   res.sendFile(path.resolve(__dirname, '../static/openapi.yaml'));
      // });

      // Sert les autres fichiers statiques
      app.get('/static/*', (req, res) => {
        console.log(`Serving static file: ${req.params[0]}`);
        res.sendFile(path.resolve(__dirname, '../static', req.params[0]));
      });
    },
  };
};
