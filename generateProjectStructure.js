const fs = require('fs');
const path = require('path');

// Directory principale da esplorare
const rootDir = path.join(__dirname, 'src'); // Cambia 'src' con il nome della tua cartella principale se diverso
const outputFilePath = path.join(__dirname, 'project_structure.txt');

// Funzione per ottenere la struttura delle directory e il contenuto dei file
const getDirectoryStructure = (dir, indentLevel = 0) => {
  let structure = '';
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const itemPath = path.join(dir, item);
    const stats = fs.statSync(itemPath);

    if (stats.isDirectory()) {
      // Escludi alcune cartelle se necessario
      if (['node_modules', '.next', '.git', 'docker', 'dist', 'build', 'public', 'out'].includes(item)) return;

      structure += `${'  '.repeat(indentLevel)}📂 ${item}\n`;
      structure += getDirectoryStructure(itemPath, indentLevel + 1);
    } else {
      // Escludi file specifici se necessario
      if (['package-lock.json', 'yarn.lock', 'Dockerfile', '.env', '.gitignore'].includes(item)) return;

      structure += `${'  '.repeat(indentLevel)}📄 ${item}\n`;

      // Lettura del contenuto del file
      const fileContent = fs.readFileSync(itemPath, 'utf8');
      structure += `${'  '.repeat(indentLevel + 1)}[Content]:\n${fileContent}\n\n`;
    }
  });

  return structure;
};

// Genera la struttura del progetto
const generateProjectStructure = () => {
  try {
    const projectStructure = getDirectoryStructure(rootDir);
    fs.writeFileSync(outputFilePath, projectStructure, 'utf8');
    console.log(`Struttura del progetto salvata in: ${outputFilePath}`);
  } catch (error) {
    console.error('Errore durante la generazione della struttura del progetto:', error);
  }
};

// Esegui lo script
generateProjectStructure();
