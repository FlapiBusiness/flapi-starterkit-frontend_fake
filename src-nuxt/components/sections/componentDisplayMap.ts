// src/components/sections/componentDisplayMap.ts
import FlapiHeroComponent from './FlapiHeroSection.vue'
import FlapiFooterComponent from './FlapiFooterSection.vue'
// ajoute d'autres composants ici

const componentDisplayMap: Record<string, any> = {
  FlapiHeroSection: FlapiHeroComponent,
  FlapiFooterSection: FlapiFooterComponent,
}

/**
 * @param {string} name - The name of the component.
 * @returns {string} The display name of the component.
 * @description This function retrieves the display name of a component based on its name.
 */
export const getComponentName: (name: string) => string = (name: string): string => {
  return componentDisplayMap[name] || name
}
