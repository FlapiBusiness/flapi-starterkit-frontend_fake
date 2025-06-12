<template>
  <div class="border-b border-gray-200">
    <button class="flex w-full items-center justify-between py-4 text-left font-medium transition-all" @click="toggle">
      <span class="ml-4 text-base font-semibold text-light-400">{{ title }}</span>
      <FlapiIcon
        :name="isOpen ? 'ChevronRight' : 'ChevronLeft'"
        color="#fff"
        class="transition-transform duration-200"
        :width="24"
        :height="24"
        mode="stroke"
      />
    </button>
    <div
      v-show="isOpen"
      class="overflow-hidden transition-all duration-200"
      :class="isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'"
    >
      <div class="pb-4">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

/**
 * @description
 * This is the model value for the FlapiCollapse component.
 * @property {string} title - The title of the collapse.
 * @property {boolean} [defaultOpen=false] - Whether the collapse is open by default.
 */
export type FlapiCollapseProps = {
  title: string
  defaultOpen?: boolean
}

const props: FlapiCollapseProps = defineProps({
  title: {
    type: String,
    required: true,
  },
  defaultOpen: {
    type: Boolean,
    default: false,
  },
})

const isOpen: Ref = ref(props.defaultOpen)

/**
 * @description
 * This function toggles the open state of the collapse.
 * @returns {void}
 */
const toggle: () => void = () => {
  isOpen.value = !isOpen.value
}
</script>
