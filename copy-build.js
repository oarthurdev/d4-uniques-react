const fs = require('fs-extra');
const path = require('path');

const srcDir = path.join(__dirname, 'build');
const destDir = path.join(__dirname, 'server/client/build');

// Remove a pasta de destino se ela já existir
fs.remove(destDir, (err) => {
  if (err) return console.error(err);
  console.log('Antigo build removido.');
  
  // Copia a nova pasta build
  fs.copy(srcDir, destDir, (err) => {
    if (err) return console.error(err);
    console.log('Build copiado para server/client/build.');
  });
});