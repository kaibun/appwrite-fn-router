// Ce script exécute tous les scripts du dossier auto/ après le build/start
const fs = require('fs');
const path = require('path');

const autoDir = __dirname;

fs.readdirSync(autoDir).forEach((file) => {
  if (file === 'run-all.js') return;
  if (file.endsWith('.js')) {
    console.log(`Running script auto/${file}`);
    require(path.join(autoDir, file));
  }
});
