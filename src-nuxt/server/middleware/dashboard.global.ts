import { parse } from 'vue-docgen-api'
import type { ComponentDoc } from 'vue-docgen-api'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename: string = fileURLToPath(import.meta.url)
const __dirname: string = path.dirname(__filename)
/**
 * Métadonnées d'un composant Vue.
 * @property {string} name - Nom du composant
 * @property {string} [description] - Description du composant
 * @property {Record<string, any>} [props] - Propriétés du composant
 * @property {Record<string, any>} [events] - Événements émis par le composant
 * @property {Record<string, any>} [slots] - Slots du composant
 * @property {string} category - Catégorie du composant (répertoire parent)
 */
type ComponentMeta = {
  name: string
  description?: string
  props?: Record<string, any>
  events?: Record<string, any>
  slots?: Record<string, any>
  category: string
}

export default defineEventHandler(async (event) => {
  if (!event.node.req.url?.includes('/dashboard')) {
    return
  }

  const componentsDir: string = path.resolve(
    process.cwd(),
    'node_modules/@flapi/cms-designsystem/dist/runtime/components',
  )
  const outputFile: string = path.resolve(process.cwd(), 'components-meta.json')

  /**
   * Parcourt récursivement un répertoire et retourne la liste complète des fichiers Vue.
   * @param {string} dir - Répertoire à parcourir
   * @param {string[]} [fileList] - Liste des fichiers trouvés (utilisé pour la récursion)
   * @param {string} [extension='.vue'] - Extension des fichiers à rechercher (par défaut '.vue')
   * @returns {string[]} - Liste des chemins complets des fichiers Vue trouvés
   * @throws {Error} - Si une erreur se produit lors de la lecture du répertoire
   */
  const getFilesRecursively: (dir: string, extension?: string, fileList?: string[]) => string[] = (
    dir: string,
    extension: string = '.vue',
    fileList: string[] = [],
  ): string[] => {
    const files: string[] = fs.readdirSync(dir)
    if (files.includes('icons')) {
      files.splice(files.indexOf('icons'), 1)
    }

    files.forEach((file: string) => {
      const filePath: string = path.join(dir, file)
      if (fs.statSync(filePath).isDirectory()) {
        getFilesRecursively(filePath, extension, fileList)
      } else if (filePath.endsWith(extension)) {
        fileList.push(filePath)
      }
    })
    return fileList
  }

  const componentsMeta: ComponentMeta[] = []
  const vueFiles: string[] = getFilesRecursively(componentsDir)

  for (const filePath of vueFiles) {
    try {
      const doc: ComponentDoc = await parse(filePath)
      componentsMeta.push({
        name: doc.displayName,
        description: doc.description,
        props: doc.props,
        events: doc.events,
        slots: doc.slots,
        category: path.relative(componentsDir, path.dirname(filePath)),
      })
    } catch (error) {
      console.error(`Failed to parse ${filePath}:`, error)
    }
  }

  // check if the output directory exists, if not create it
  const outputDir: string = path.dirname(outputFile)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  fs.writeFileSync(outputFile, JSON.stringify(componentsMeta, null, 2))

  const listeIconesDir: string = path.resolve(
    process.cwd(),
    'node_modules/@flapi/cms-designsystem/dist/runtime/components/icons',
  )
  const listeIcones: string[] = fs.readdirSync(listeIconesDir).filter((file: string) => file.endsWith('.vue'))
  console.log(`Found ${listeIcones.length} icons in ${listeIconesDir}`)
  const iconsMeta: string[] = listeIcones.map((icon: string) => {
    const iconName: string = path.basename(icon, '.vue')
    return iconName
  })

  // output = /assets/icons/liste.json
  const iconsOutputFile: string = path.resolve(process.cwd(), 'src-nuxt/assets/icons/liste.json')
  const iconsOutputDir: string = path.dirname(iconsOutputFile)
  if (!fs.existsSync(iconsOutputDir)) {
    fs.mkdirSync(iconsOutputDir, { recursive: true })
  }
  fs.writeFileSync(iconsOutputFile, JSON.stringify(iconsMeta, null, 2))
})
