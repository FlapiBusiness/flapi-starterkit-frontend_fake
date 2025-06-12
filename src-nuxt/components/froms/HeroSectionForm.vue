<template>
  <div class="flex w-full min-w-[576px] max-w-xl flex-col gap-4">
    <FlapiInput
      v-model:value="values.title"
      label="Titre de la section"
      placeholder="titre de la section"
      type="textarea"
    >
    </FlapiInput>

    <FlapiInput
      v-model:value="values.content"
      label="Contenu de la section"
      placeholder="contenu de la section"
      type="textarea"
    ></FlapiInput>

    <div class="flex flex-row items-center justify-between">
      <FlapiLabel id="showImage"> Ajouter une image </FlapiLabel>
      <FlapiCheckbox v-model="values.showImage"></FlapiCheckbox>
    </div>

    <FlapiInput
      v-if="values.showImage"
      v-model:value="values.imageUrl"
      label="Lien de l'image"
      placeholder="http://example.com/image.jpg"
      type="text"
    ></FlapiInput>

    <div class="flex flex-row items-center justify-between">
      <FlapiLabel id="showButton">Ajouter un bouton</FlapiLabel>
      <FlapiCheckbox v-model="values.showButton"></FlapiCheckbox>
    </div>
    <FlapiInput
      v-if="values.showButton"
      v-model:value="values.buttonLabel"
      label="Texte du bouton"
      placeholder="Texte du bouton"
      type="text"
    ></FlapiInput>

    <FlapiButton
      class="mt-4"
      :disabled="!formIsValid"
      variant="primary"
      size="lg"
      type="button"
      :loading="false"
      @click="submit()"
    >
      Créer la section
    </FlapiButton>
    <FlapiAlert v-if="errorMessage" :message="errorMessage" variant="error" dismissible />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import type { Ref, ComputedRef } from 'vue'
import FlapiCheckbox from '../inputs/FlapiCheckbox.vue'
import type { CmsComponentSkeleton } from '~/components/type/CmsComponentSkeleton'

/**
 * This is the model value for the HeroSection component.
 * @property {string} title - The title of the component.
 * @property {string} content - The content of the component.
 * @property {string} imageUrl - The image URL of the component.
 * @property {boolean} showImage - Whether to show the image or not.
 * @property {boolean} showButton - Whether to show the button or not.
 * @property {string} buttonLabel - The label of the button.
 * @property {string} buttonLink - The link of the button.
 */
export type HeroSectionPayload = {
  title: string
  content: string
  imageUrl: string
  showImage: boolean
  showButton: boolean
  buttonLabel: string
}

const values: Ref<HeroSectionPayload> = ref({
  title: 'lorem ipsum',
  content:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  showImage: true,
  imageUrl: 'https://www.epita.fr/wp-content/uploads/2017/08/Campus-de-rennes-1439x438.jpg',
  showButton: true,
  buttonLabel: 'Lorem ipsum',
})
const errorMessage: Ref<string | null> = ref(null)

const emit: (event: 'submit', values: CmsComponentSkeleton) => void = defineEmits<{
  (event: 'submit', values: CmsComponentSkeleton): void
}>()

/**
 * This function submits the form values.
 * @returns {void}
 */
const submit: () => void = (): void => {
  const component: CmsComponentSkeleton = {
    name: 'HeroSection',
    description: 'Hero section component',
    category: 'Flapi Components',
    props: values.value,
  }

  if (formIsValid.value) {
    emit('submit', component)
  }
}

const formIsValid: ComputedRef<boolean> = computed(() => {
  return (
    values.value.title !== '' &&
    values.value.content !== '' &&
    (values.value.showButton ? values.value.buttonLabel !== '' : true) &&
    (values.value.showImage ? values.value.imageUrl !== '' : true)
  )
})
</script>
