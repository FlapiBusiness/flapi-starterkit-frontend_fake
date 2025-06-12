<template>
  <div
    v-for="(component, index) in cmsComponents"
    :key="index"
    draggable="true"
    @dragstart="onDragStart(index)"
    @dragover.prevent
    @dragleave="onDragLeave"
    @drop="onDrop(index)"
    @dragover="onDragOver(index)"
    @contextmenu.prevent="onContextMenu($event, index)"
    @click="closeContextMenu"
    @mouseenter="hoveredIndex = index"
    :class="[
      'group relative my-2 p-1 transition',
      hoveredIndex === index ? 'border-2 border-blue-500' : 'border border-gray-300',
    ]"
  >
    <!-- @mouseleave="closeContextMenu" -->
    <component :is="getComponentName(component.name)" v-bind="component.data" />
  </div>
  <div
    v-if="contextMenu.index !== null"
    :style="{ position: 'fixed', top: contextMenu.y + 'px', left: contextMenu.x + 'px', zIndex: 1000 }"
    class="rounded border bg-gray-500 p-2 shadow"
  >
    <button
      class="block w-full rounded px-2 py-1 text-left text-sm font-medium text-light-400 hover:bg-gray-600"
      @click="removeComponent(contextMenu.index)"
    >
      Supprimer
    </button>
    <button
      class="block w-full rounded px-2 py-1 text-left text-sm font-medium text-light-400 hover:bg-gray-600"
      @click="updateCmsComponents(contextMenu.index)"
    >
      Modifier
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useCmsComponentStore } from '~/stores/cmsComponentStore'
import type { CmsComponentStore } from '~/stores/cmsComponentStore'
import { getComponentName } from '@/components/sections/componentDisplayMap'

import type { Ref } from 'vue'
import { ref } from 'vue'

definePageMeta({
  layout: 'cms',
})

const cmsComponentStore: ReturnType<typeof useCmsComponentStore> = useCmsComponentStore()
const cmsComponents: Ref<CmsComponentStore[]> = ref(cmsComponentStore.components)
const hoveredIndex: Ref<number | null> = ref(null)
let draggedIndex: number = -1
const contextMenu: Ref = ref<{ x: number; y: number; index: number | null }>({ x: 0, y: 0, index: null })

onMounted(() => {
  const published: CmsComponentStore[] = localStorage.getItem('cmsComponents')
    ? JSON.parse(localStorage.getItem('cmsComponents') as string)
    : []

  cmsComponentStore.setCmsComponentStores(published)
  cmsComponents.value = published
})
/**
 * @param {number} index - The index of the component being dragged.
 * @returns {void}
 * @description This function sets the components in the store and local storage.
 */
const onDragStart: (index: number) => void = (index: number): void => {
  draggedIndex = index
}

/**
 * @param {number} dropIndex - The index where the component is dropped.
 * @returns {void}
 * @description This function handles the drop event and reorders the components.
 */
const onDrop: (dropIndex: number) => void = (dropIndex: number): void => {
  const items: CmsComponentStore[] = [...cmsComponents.value]
  const draggedItem: CmsComponentStore = items.splice(draggedIndex, 1)[0]
  items.splice(dropIndex, 0, draggedItem)

  // Réaffecte les ordres
  items.forEach((item: CmsComponentStore, index: number) => (item.order = index + 1))
  cmsComponents.value = items
  cmsComponentStore.setCmsComponentStores(items)

  hoveredIndex.value = null
}

/**
 * @param {number} index - The index of the component being dragged over.
 * @returns {void}
 * @description This function sets the hovered index when a component is dragged over.
 */
const onDragOver: (index: number) => void = (index: number): void => {
  hoveredIndex.value = index
}

/**
 * @returns {void}
 */
const onDragLeave: () => void = (): void => {
  hoveredIndex.value = null
}

/**
 * @param {number} index - The index of the component being dragged over.
 * @returns {void}
 */
const removeComponent: (index: number) => void = (index: number): void => {
  cmsComponents.value.splice(index, 1)
  cmsComponents.value.forEach((item: CmsComponentStore, i: number) => (item.order = i + 1))
  cmsComponentStore.setCmsComponentStores(cmsComponents.value)
}

/**
 * @param {number} index - The index of the component to update.
 * @returns {void}
 * @description This function sets the current component in the store and opens the modal for editing.
 */
const updateCmsComponents: (index: number) => void = (index: number): void => {
  // TODO: Implement the logic to update the component
  const currentComponent: CmsComponentStore = cmsComponents.value[index]
  cmsComponentStore.updateCmsComponentStore(currentComponent)
}

/**
 * @param {MouseEvent} event - The mouse event that triggered the context menu.
 * @param {number} index - The index of the component for which the context menu is opened.
 * @returns {void}
 * @description This function opens a context menu at the position of the mouse event.
 */
const onContextMenu: (event: MouseEvent, index: number) => void = (event: MouseEvent, index: number): void => {
  event.preventDefault()
  contextMenu.value = {
    x: event.clientX,
    y: event.clientY,
    index: index,
  }
}

/**
 * @returns {void}
 * @description This function closes the context menu.
 */
const closeContextMenu: () => void = (): void => {
  contextMenu.value.index = null
  contextMenu.value.x = 0
  contextMenu.value.y = 0
}
</script>
