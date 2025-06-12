<template>
  <nav class="flex h-full text-sm">
    <div class="relative w-[400px] bg-gray-500 shadow-md">
      <FlapiCollapse title="Flapi Components" defaultOpen>
        <div class="m-4 grid grid-cols-2 items-center gap-4">
          <FlapiComponentCard
            v-for="component in flapiComponents"
            :key="component.name"
            :label="component.label"
            :name="component.name"
            :imageUrl="component.imageUrl"
            @select="emit('select', component)"
            :draggable="true"
          />
        </div>
        <!-- @dragstart="onSidebarDragStart(component)" -->
      </FlapiCollapse>
      <FlapiCollapse v-for="category in flapiCmsComponentsArranged" :key="category.name" :title="category.name">
        <div class="m-4 grid h-full grid-cols-2 items-center gap-4">
          <FlapiCmsComponentCard
            v-for="component in category.components"
            :key="component.name"
            :name="component.name"
            :description="component.description"
            :props="component.props"
            :category="component.category"
            :slots="component.slots"
            :events="component.events"
            @select="emit('select', component)"
          />
        </div>
      </FlapiCollapse>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import FlapiComponentCard from '@/components/card/ComponentCard.vue'
import FlapiCmsComponentCard from '../card/FlapiCmsComponentCard.vue'
import FlapiCollapse from '@/components/display/FlapiCollapse.vue'
import type { ComputedRef } from 'vue'
import type { FlapiComponentCardProps } from '@/components/card/ComponentCard.vue'
import type { FlapiCmsComponentCardProps } from '../card/FlapiCmsComponentCard.vue'
import type { FlapiCmsComponent } from '~/composables/type/FlapiCmsComponent'

/**
 * @description
 * This is the model value for the Flapi CMS component.
 * @property {string} category - The category of the component.
 * @property {FlapiCmsComponent[]} components - The components in the category.
 */
type FlapiCmsComponentArranged = {
  name: string
  components: FlapiCmsComponent[]
}

const { getAllComponents } = useComponentsMeta()

const flapiCmsComponents: FlapiCmsComponent[] = getAllComponents()
const flapiCmsComponentsArranged: ComputedRef<FlapiCmsComponentArranged[]> = computed(() => {
  const categories: FlapiCmsComponentArranged[] = []

  flapiCmsComponents.forEach((component: FlapiCmsComponent) => {
    if (categories.find((c: FlapiCmsComponentArranged) => c.name === component.category)) {
      categories.find((c: FlapiCmsComponentArranged) => c.name === component.category)?.components.push(component)
    } else {
      categories.push({
        name: component.category,
        components: [component],
      })
    }
  })
  return categories
})

const flapiComponents: FlapiComponentCardProps[] = [
  {
    label: 'Hero',
    name: 'FlapiHeroSection',
  },
  {
    label: 'Footer',
    name: 'FlapiFooterSection',
  },
]

const emit: (event: 'select', component: FlapiComponentCardProps | FlapiCmsComponentCardProps) => void = defineEmits<{
  (event: 'select', component: FlapiComponentCardProps | FlapiCmsComponentCardProps): void
}>()

// /**
//  * This function handles the drag start event for the sidebar components.
//  * It sets the data to be transferred during the drag operation.
//  * @param {FlapiComponentCardProps | FlapiCmsComponentCardProps} component - The component being dragged.
//  * @returns {void}
//  */
// const onSidebarDragStart: (component: FlapiComponentCardProps | FlapiCmsComponentCardProps) => void = (
//   component: FlapiComponentCardProps | FlapiCmsComponentCardProps,
// ): void => {
//   console.log('Drag started for component:', component.name)

//   // TODO: Implement the logic to handle the drag start event.
// }
</script>
