import { defineStore } from 'pinia'
import type { FlapiComponentCardProps } from '~/components/card/ComponentCard.vue'
import type { FlapiCmsComponentCardProps } from '~/components/card/FlapiCmsComponentCard.vue'

/**
 * CmsComponentStore interface.
 * @interface
 */
export interface CmsComponentStore {
  name: string
  order: number
  data: FlapiComponentCardProps | FlapiCmsComponentCardProps | CmsComponentStore
  page_slug: string
}

/**
 * CmsComponentStore store.
 */
interface CmsComponentStoreState {
  components: CmsComponentStore[]
  currentComponent: CmsComponentStore | FlapiComponentCardProps | FlapiCmsComponentCardProps | null
  isModalOpen: boolean
}
/**
 * CmsComponentStore actions.
 * @interface
 */
interface CmsComponentStoreActions {
  setCmsComponentStores(components: CmsComponentStore[]): void
  addCmsComponentStore(component: CmsComponentStore): void
  publishCmsComponentStores(): void
  setCurrentComponentStore(component: CmsComponentStore): void
  setIsModalOpen(isOpen: boolean): void
  updateCmsComponentStore(component: CmsComponentStore): void
}

/**
 * CmsComponentStore store.
 * @type {import('pinia').DefineStore<'CmsComponentStoreStore', CmsComponentStoreState, {}, CmsComponentStoreActions>}
 * @returns {import('pinia').StoreWithoutState<import('pinia').DefineStoreOptions<'CmsComponentStoreStore', CmsComponentStoreState, {}, CmsComponentStoreActions>>}
 */
export const useCmsComponentStore: ReturnType<
  typeof defineStore<'CmsComponentStoreStore', CmsComponentStoreState, {}, CmsComponentStoreActions>
> = defineStore<'CmsComponentStoreStore', CmsComponentStoreState, {}, CmsComponentStoreActions>(
  'CmsComponentStoreStore',
  {
    /**
     * CmsComponentStore store state.
     * @returns {CmsComponentStoreState} The state of the components store.
     */
    state: (): CmsComponentStoreState => ({
      components: [],
      currentComponent: null,
      isModalOpen: false,
    }),
    actions: {
      /**
       * Set the components
       * @param {CmsComponentStore[]} components - The components.
       * @returns {void}
       */
      setCmsComponentStores(components: CmsComponentStore[]): void {
        this.components = components
      },
      /**
       * Add a component
       * @param {CmsComponentStore} component - The component.
       * @returns {void}
       */
      addCmsComponentStore(component: CmsComponentStore): void {
        this.components.push(component)
      },
      /**
       * Set the current component store
       * @param {CmsComponentStore} component - The component.
       * @returns {void}
       */
      setCurrentComponentStore(component: CmsComponentStore): void {
        this.currentComponent = component
      },
      /**
       * Set the modal open state
       * @param {boolean} isOpen - The modal open state.
       * @returns {void}
       */
      setIsModalOpen(isOpen: boolean): void {
        this.isModalOpen = isOpen
      },

      /**
       * Update a component
       * @param {CmsComponentStore} component - The component.
       * @returns {void}
       */
      updateCmsComponentStore(component: CmsComponentStore): void {
        const index: number = this.components.findIndex((c: CmsComponentStore) => c.name === component.name)
        if (index !== -1) {
          this.components[index] = component
        }
      },

      /**
       * Publish the components
       * @returns {void}
       */
      publishCmsComponentStores(): void {
        // save the components to lacal storage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cmsComponents', JSON.stringify(this.components))
        }
      },
    },
  },
)
