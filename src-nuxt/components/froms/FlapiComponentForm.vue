<template>
  <div
    class="sm:min-w-sm flex max-h-[80vh] w-full max-w-2xl flex-col gap-4 overflow-y-auto text-light-400 md:min-w-[500px] md:max-w-3xl lg:min-w-[1000px] lg:max-w-4xl"
  >
    <div class="felx-row flex items-center">
      <h1 class="text-xl font-medium text-light-400">{{ component.name }}</h1>
      <span class="text-xs m-4 rounded bg-indigo-100 px-2 py-1 font-medium text-indigo-800">
        {{ component.category }}
      </span>
    </div>

    <div v-if="component.description" class="text-base font-medium text-light-400">
      {{ component.description }}
    </div>

    <form @submit.prevent="submit" class="space-y-6">
      <div v-if="component.props?.length" class="space-y-4">
        <div id="props-section-title" slotContent="Properties" class="text-sm font-medium"></div>

        <div v-for="(prop, index) in component.props" :key="index" class="space-y-2">
          <div class="flex items-center justify-between">
            <div :slotContent="prop.name" class="block text-sm font-medium capitalize text-gray-700"></div>
            <div v-if="prop.type.name" class="text-xs font-medium text-light-400">
              {{ prop.type.name }}
            </div>
            <div v-if="prop.type.names" class="text-xs font-medium text-light-400">
              {{ prop.type.names.join(' | ') }}
            </div>
          </div>

          <FlapiInput
            v-if="
              prop.type.name !== 'boolean' &&
              prop.type.name !== 'color' &&
              prop.type.name !== '(typeof iconsList)[number]' &&
              !prop.type.elements?.length
            "
            v-model:value="formValues.props[prop.name]"
            :label="prop.name"
            :placeholder="prop.defaultValue ? getDefaultValue(prop.defaultValue) : ''"
            type="text"
          />

          <select
            v-if="prop.type.name === '(typeof iconsList)[number]'"
            v-model="formValues.props[prop.name]"
            class="relative flex h-12 w-full items-center justify-center rounded-md border-2 border-transparent bg-gray-400 pl-3 text-base text-light-400 placeholder:text-light-300 hover:border-light-300 focus:border-primary-400 focus:bg-gray-500"
          >
            <option v-for="option in iconsList" :key="option" :value="option">
              {{ option }}
            </option>
          </select>

          <div v-if="prop.type.name === 'boolean'" class="flex flex-row items-center gap-2">
            <div class="text-sm font-medium text-white">{{ prop.name }}</div>
            <FlapiCheckbox v-model:checked="formValues.props[prop.name]" :label="prop.name" />
          </div>

          <!-- Color Picker TODO: Uncomment when FlapiColorPicker is available -->
          <!-- <div v-else-if="prop.name.includes('Color')" class="flex items-center gap-2">
            <div class="text-sm font-medium text-white">FlapiColorPicker</div>
            <FlapiColorPicker :id="`color-picker-${index}`" v-model:value="formValues.props[prop.name]" :label="prop.name" />
          </div> -->

          <FlapiSelect
            v-else-if="prop.type.elements?.length"
            v-model:value="formValues.props[prop.name]"
            :label="prop.name"
            :options="prop.type.elements.map((el) => ({ value: el.name, label: el.name }))"
          />

          <div
            v-if="prop.defaultValue"
            :slotContent="'Default Value: ' + getDefaultValue(prop.defaultValue)"
            class="text-xs"
          ></div>
        </div>
      </div>

      <div class="border-t border-gray-200 pt-4">
        <FlapiButton type="submit" variant="primary" size="md" class="w-full" @click="submit"
          >Ajouter le composant</FlapiButton
        >
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Ref } from 'vue'
import type { FlapiProp, DefaultValue, FlapiCmsComponent } from '~/composables/type/FlapiCmsComponent'
import FlapiCheckbox from '../inputs/FlapiCheckbox.vue'
import ListeIcons from '~/assets/icons/liste.json'

const iconsList: string[] = ListeIcons as string[]

/**
 * @description
 * This is the model value for the Flapi CMS component form.
 * @property {string} name - The name of the component.
 */
export type FlapiFormProps = {
  component: FlapiCmsComponent
  index?: number
}

const props: FlapiFormProps = defineProps({
  component: {
    type: Object as () => FlapiCmsComponent,
    required: true,
  },
  index: {
    type: Number,
    default: -1,
  },
})

const formValues: Ref<Record<string, any>> = ref({
  name: props.component.name,
  description: props.component.description || '',
  props: {},
  slots: props.component.slots || {},
  index: props.index || -1,
  category: props.component.category || '',
})

/**
 * @description
 * This function retrieves the default value for a prop.
 * It handles different types of default values such as strings, booleans, and numbers.
 * @param {DefaultValue} defaultValue - The default value object containing func and value.
 * @returns {any} The processed default value.
 */
const getDefaultValue: (defaultValue: DefaultValue) => any = (defaultValue: DefaultValue) => {
  if (defaultValue.func) return null

  if (defaultValue.value.startsWith("'") && defaultValue.value.endsWith("'")) {
    return defaultValue.value.slice(1, -1)
  }

  if (defaultValue.value === 'true') return true
  if (defaultValue.value === 'false') return false
  if (defaultValue.value === 'null') return null

  // if (!isNaN(Number(defaultValue.value))) {
  //   return Number(defaultValue.value)
  // }

  return defaultValue.value
}

const emit: (event: 'submit', values: Record<string, any>) => void = defineEmits<{
  (event: 'submit', value: Record<string, any>): void
}>()

/**
 * @description
 * This function handles the form submission.
 * It validates the form values and emits the 'submit' event with the values.
 */
const submit: () => void = () => {
  // for (const key in formValues.value) {
  //   if (formValues.value[key] === undefined || formValues.value[key] === null) {
  //     formValues.value[key] = ''
  //   }
  // }

  console.log('Form submitted with values:', JSON.stringify(formValues.value, null, 2))

  emit('submit', formValues.value)
}

onMounted(() => {
  formValues.value.props = props.component.props?.reduce((acc: Record<string, any>, prop: FlapiProp) => {
    if (prop.type.name === '(typeof iconsList)[number]') {
      acc[prop.name] = prop.defaultValue ? getDefaultValue(prop.defaultValue) : 'Account'
    } else {
      acc[prop.name] = prop.defaultValue ? getDefaultValue(prop.defaultValue) : ''
    }
    return acc
  }, {})
})
</script>
