import { parse } from 'vue-docgen-api'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const componentsDir = path.resolve(__dirname, '../node_modules/@flapi/cms-designsystem/dist/runtime/components')
const outputFile = path.resolve(__dirname, '../components-meta.json')

/**
 * Parcourt récursivement un répertoire et retourne la liste complète des fichiers avec une extension spécifique.
 * @param {string} dir - Le répertoire de départ.
 * @param {string[]} fileList - La liste accumulée des fichiers.
 * @param {string} ext - L'extension des fichiers à rechercher.
 * @returns {string[]} - La liste complète des fichiers trouvés.
 */
function getFilesRecursively(dir, fileList = [], ext = '.vue') {
  const files = fs.readdirSync(dir)
  files.forEach((file) => {
    const filePath = path.join(dir, file)
    if (fs.statSync(filePath).isDirectory()) {
      getFilesRecursively(filePath, fileList, ext)
    } else if (filePath.endsWith(ext)) {
      fileList.push(filePath)
    }
  })
  return fileList
}

/**
 * Génère les métadonnées des composants Vue présents dans le répertoire spécifié.
 * Les métadonnées incluent le nom du composant, sa description, ses props, événements, slots et sa catégorie.
 * Les métadonnées sont sauvegardées dans un fichier JSON.
 */
async function generateComponentsMeta() {
  const componentsMeta = []
  const vueFiles = getFilesRecursively(componentsDir)

  for (const filePath of vueFiles) {
    console.log(`Processing file: ${filePath}`)
    try {
      const doc = await parse(filePath)
      componentsMeta.push({
        name: doc.displayName,
        description: doc.description,
        props: doc.props,
        events: doc.events,
        slots: doc.slots,
        category: path.relative(componentsDir, path.dirname(filePath)),
      })
    } catch (error) {
      console.error(`Failed to parse ${filePath}: ${error.message}`)
    }
  }

  fs.writeFileSync(outputFile, JSON.stringify(componentsMeta, null, 2))
  console.log('Components metadata generated successfully.')
}

generateComponentsMeta().catch(console.error)
