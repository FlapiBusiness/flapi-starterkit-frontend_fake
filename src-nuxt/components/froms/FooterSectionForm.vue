<template>
  <div class="flex max-h-[80vh] w-full min-w-[1200px] max-w-2xl flex-col gap-4 overflow-y-auto">
    <FlapiInput v-model:value="values.title" label="Titre de la section" placeholder="Flapi CMS" type="text" />

    <div v-for="(item, index) in values.items" :key="index" class="grid grid-cols-2 items-end gap-4 border-t pt-4">
      <FlapiInput v-model:value="item.title" label="Titre de la colonne" placeholder="Par ex. Services" type="text" />
      <FlapiSquareButton
        variant="outline"
        class="w-fit"
        :size="48"
        backgroundColor="#EC364B"
        backgroundHoverColor="#C0172A"
        @click="removeItem(index)"
      >
        <FlapiIcon color="#fff" :height="24" mode="stroke" name="Trash2" viewBox="0 0 24 24" :width="24" />
      </FlapiSquareButton>

      <div
        v-for="(sub, subIndex) in item['sub-items']"
        :key="subIndex"
        class="col-span-2 ml-4 mt-2 grid grid-cols-5 items-end gap-4"
      >
        <FlapiInput
          v-model:value="sub['sub-title']"
          label="Nom du lien"
          placeholder="Ex: Blog"
          type="text"
          class="col-span-2"
        />
        <FlapiInput v-model:value="sub.link" class="col-span-2" label="Lien" placeholder="/blog" type="text" />
        <FlapiSquareButton
          variant="outline"
          class="w-fit"
          :size="48"
          backgroundColor="#EC364B"
          backgroundHoverColor="#C0172A"
          @click="removeSubItem(index, subIndex)"
        >
          <FlapiIcon color="#fff" :height="24" mode="stroke" name="Trash2" viewBox="0 0 24 24" :width="24" />
        </FlapiSquareButton>
      </div>

      <FlapiButton variant="outline" class="ml-4 mt-2 w-fit" size="sm" @click="addSubItem(index)">
        Ajouter un lien
      </FlapiButton>
    </div>

    <FlapiButton variant="outline" class="mt-2 w-fit" size="sm" @click="addItem"> Ajouter une colonne </FlapiButton>

    <FlapiButton
      class="mt-4"
      :disabled="!formIsValid"
      variant="primary"
      size="lg"
      type="button"
      :loading="false"
      @click="submit"
    >
      Enregistrer le footer
    </FlapiButton>

    <FlapiAlert v-if="errorMessage" :message="errorMessage" variant="error" dismissible />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, type ComputedRef } from 'vue'
import type { CmsComponentSkeleton } from '~/components/type/CmsComponentSkeleton'

/**
 * @description
 * FooterSubItem represents a sub-item in the footer with a link and title.
 */
type FooterSubItem = {
  link: string
  'sub-title': string
}

/**
 * @description
 * FooterItem represents a sub-item in the footer with a link and title.
 */
type FooterItem = {
  title: string
  'sub-items': FooterSubItem[]
}

/**
 * @description
 * FlapiFooterPayload represents the payload for the footer section.
 */
type FlapiFooterPayload = {
  title: string
  items: FooterItem[]
}

const values: Ref<FlapiFooterPayload> = ref<FlapiFooterPayload>({
  title: 'Flapi CMS',
  items: [
    {
      title: 'Services',
      'sub-items': [{ link: '/blog', 'sub-title': 'Blog' }],
    },
  ],
})

const emit: (event: 'submit', values: CmsComponentSkeleton) => void = defineEmits<{
  (event: 'submit', value: CmsComponentSkeleton): void
}>()

const errorMessage: Ref<string | null> = ref<string | null>(null)

const formIsValid: ComputedRef<boolean> = computed(() => {
  return (
    values.value.title.trim() !== '' &&
    values.value.items.every(
      (item: FooterItem) =>
        item.title.trim() !== '' &&
        item['sub-items'].every((sub: FooterSubItem) => sub.link.trim() !== '' && sub['sub-title'].trim() !== ''),
    )
  )
})

/**
 * @description
 * submit emits the submit event with the form values.
 */
const submit: () => void = () => {
  if (formIsValid.value) {
    const component: CmsComponentSkeleton = {
      name: 'FlapiFooterSection',
      description: 'Footer section component',
      category: 'Flapi Components',
      props: values.value,
    }
    emit('submit', component)
    errorMessage.value = null // Réinitialiser le message d'erreur
  } else {
    errorMessage.value = 'Tous les champs doivent être remplis.'
  }
}

/**
 * @description
 * addItem adds a new item to the footer section.
 */
const addItem: () => void = () => {
  values.value.items.push({ title: '', 'sub-items': [] })
}

/**
 * @param {number} index - The index of the item in the items array.
 */
const removeItem: (index: number) => void = (index: number) => {
  if (index >= 0 && index < values.value.items.length) {
    values.value.items.splice(index, 1)
  }
}

/**
 * @param {number} index - The index of the item in the items array.
 */
const addSubItem: (index: number) => void = (index: number) => {
  if (index >= 0 && index < values.value.items.length) {
    values.value.items[index]['sub-items'].push({ link: '', 'sub-title': '' })
  }
}

/**
 * @param {number} itemIndex - The index of the item in the items array.
 * @param {number} subIndex - The index of the sub-item in the 'sub-items' array.
 * @description
 */
const removeSubItem: (itemIndex: number, subIndex: number) => void = (itemIndex: number, subIndex: number) => {
  if (
    itemIndex >= 0 &&
    itemIndex < values.value.items.length &&
    subIndex >= 0 &&
    subIndex < values.value.items[itemIndex]['sub-items'].length
  ) {
    values.value.items[itemIndex]['sub-items'].splice(subIndex, 1)
  }
}
</script>
