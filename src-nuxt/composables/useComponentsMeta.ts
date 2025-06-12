import rawComponentsMeta from '../../components-meta.json'
import type { FlapiCmsComponent } from './type/FlapiCmsComponent'

const componentsMeta: FlapiCmsComponent[] = rawComponentsMeta as FlapiCmsComponent[]

/**
 * Composable to manage and retrieve component metadata.
 * This composable provides methods to get all components, a specific component by name,
 * components filtered by category, and the props of a specific component.
 * @returns {object} An object containing methods to interact with component metadata.
 * @property {Function} getAllComponents - Returns all components metadata.
 * @property {Function} getComponent - Returns a specific component by name.
 * @property {Function} getComponentsByCategory - Returns components filtered by category.
 * @property {Function} getComponentProps - Returns the props of a specific component.
 */
export const useComponentsMeta: () => {
  getAllComponents: () => FlapiCmsComponent[]
  getComponent: (name: string) => FlapiCmsComponent | undefined
  getComponentsByCategory: (category: string) => FlapiCmsComponent[]
  getComponentProps: (name: string) => any[]
} = () => {
  /**
   * Returns all components metadata.
   * @returns {FlapiCmsComponent[]} An array of all component metadata objects.
   */
  const getAllComponents: () => FlapiCmsComponent[] = (): FlapiCmsComponent[] => {
    return componentsMeta
  }

  /**
   * Returns a specific component by name.
   * @param {string} name - The name of the component.
   * @returns {FlapiCmsComponent | undefined} The component metadata if found, otherwise undefined.
   */
  const getComponent: (name: string) => FlapiCmsComponent | undefined = (
    name: string,
  ): FlapiCmsComponent | undefined => {
    return componentsMeta.find((c: FlapiCmsComponent) => c.name === name)
  }

  /**
   * Returns components filtered by category.
   * @description This function filters components based on the provided category.
   * @param {string} category - The category to filter components by.
   * @returns {FlapiCmsComponent[]} An array of components that belong to the specified category.
   */
  const getComponentsByCategory: (category: string) => FlapiCmsComponent[] = (
    category: string,
  ): FlapiCmsComponent[] => {
    return componentsMeta.filter((c: FlapiCmsComponent) => c.category === category)
  }

  /**
   * Returns the props of a specific component.
   * @param {string} name - The name of the component.
   * @returns {any[]} An array of props for the specified component, or an empty array if not found.
   */
  const getComponentProps: (name: string) => any[] = (name: string): any[] => {
    const component: FlapiCmsComponent | undefined = getComponent(name)
    return component?.props || []
  }

  return {
    getAllComponents,
    getComponent,
    getComponentsByCategory,
    getComponentProps,
  }
}
