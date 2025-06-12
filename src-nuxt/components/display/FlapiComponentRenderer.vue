<template>
  <component :is="getComponentName(component.name)" v-bind="component.props">
    <template
      v-for="slot in component.slots"
      :key="slot.name"
      #[slot.name]="slotProps"
      v-slot="{ slot }: { slot: { name: string } }"
    >
      <slot :name="slot.name" v-bind="slotProps || {}">
        <div class="text-center text-sm text-gray-500">
          {{ slot.name }}
        </div>
      </slot>

      <FlapiComponentRenderer
        v-for="(childComponent, index) in component.slots"
        :key="childComponent.name"
        :component="childComponent.components?.[index]"
      />
    </template>
  </component>
</template>

<script setup lang="ts">
// import { defineAsyncComponent } from 'vue'
import { getComponentName } from '@/components/sections/componentDisplayMap'
import type { CmsComponentSkeleton } from '@/components/type/CmsComponentSkeleton'

defineProps({
  component: {
    type: Object as () => CmsComponentSkeleton,
    /**
     * @description
     * The component to render, which should have a structure like:
     * @returns {CmsComponentSkeleton} The component skeleton object.
     */
    default: () => ({}),
  },
})
</script>
