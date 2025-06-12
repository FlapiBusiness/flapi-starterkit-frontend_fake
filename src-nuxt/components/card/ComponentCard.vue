<template>
  <div
    class="flex h-[170px] w-[170px] cursor-pointer flex-col items-start justify-center rounded-2xl border-[3px] border-transparent bg-gray-300 p-4 transition hover:border-primary-300"
    @click="emit('select', props)"
  >
    <div class="flex w-full flex-col items-center">
      <img :name="label" :src="props.imageUrl" :alt="props.label" />
      <p class="mt-4 text-center text-base font-semibold text-light-400">
        {{ label }}
      </p>
    </div>
  </div>
</template>
<script lang="ts" setup>
/**
 * @description
 * This is the model value for the select field.
 * @property {string} label - The label of the component.
 * @property {string} type - The type of the component.
 * @property {string} [imageUrl] - The imageUrl of the component.
 */
export type FlapiComponentCardProps = {
  label: string
  name: string
  imageUrl?: string
}

const props: FlapiComponentCardProps = defineProps({
  label: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default: 'https://placehold.co/600x400',
  },
})

const emit: (event: 'select', component: FlapiComponentCardProps) => void = defineEmits<{
  (event: 'select', component: FlapiComponentCardProps): void
}>()
</script>
