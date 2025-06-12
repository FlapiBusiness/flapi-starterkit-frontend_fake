import type { FlapiEvent, FlapiSlot } from '~/composables/type/FlapiCmsComponent'

/**
 * FlapiCmsComponent interface definition
 * @description This interface defines the structure of a component's metadata in the Flapi system.
 * It includes properties such as name, description, props, category, slots, and events.
 * @property {string} name - The name of the component.
 * @property {string} description - A brief description of the component.
 * @property {FlapiProp[]} [props] - An optional array of properties (props) that the component accepts.
 * @property {string} category - The category to which the component belongs.
 * @property {FlapiSlot[]} [slots] - An optional array of slots that the component can use.
 * @property {FlapiEvent[]} [events] - An optional array of events that the component can emit.
 */
export type CmsComponentSkeleton = {
  name: string
  description: string
  props?: Record<string, any>
  category: string
  slots?: FlapiSlot[]
  events?: FlapiEvent[]
}
