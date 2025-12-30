<script setup lang="ts">
import * as z from 'zod/v4'
import type { RadioGroupItem } from '@nuxt/ui'

// const { data: bearer } = await useAsyncData('bearer', () => $fetch('/api/bearer'))

const workRequiredOptions = ref<RadioGroupItem[]>([
  {
    label: 'Cat → Back',
    value: 'catBack',
    description: 'From the catalytic converter to the tailpipe.'
  },
  {
    label: 'Manifold → Back',
    value: 'maniBack',
    description: 'From the manifold to the tailpipe.'
  },
  {
    label: 'Backbox Only',
    value: 'backBoxOnly',
    description: 'Replacement or upgrade of the rear silencer.'
  },
  {
    label: 'Tailpipes Only',
    value: 'tailpipesOnly',
    description: 'Just the visible tailpipe section.'
  },
  {
    label: 'Full System',
    value: 'fullSystem',
    description: 'Complete exhaust system replacement.'
  },
  {
    label: 'Full System with Remap',
    value: 'fullSystemWithRemap',
    description: 'Exhaust replacement plus engine remapping for performance.'
  },
  {
    label: 'Other (please specify in notes)',
    value: 'other',
    description: 'Any other specific exhaust work required.'
  }
])

const schema = z.object({
  name: z.string('Name is required').nonempty('Name is required'),
  email: z.email('Invalid email').nonempty('Email is required'),
  telephone: z.string().optional(),
  makeModel: z.string().optional(),
  registration: z.string().optional(),
  postcode: z.string().optional(),
  workRequired: z.enum(['catBack', 'maniBack', 'backBoxOnly', 'tailpipesOnly', 'fullSystem', 'fullSystemWithRemap', 'other']),
  notes: z.string().optional()
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  telephone: undefined,
  makeModel: undefined,
  registration: undefined,
  postcode: undefined,
  workRequired: undefined,
  notes: undefined
})

const plateFormatted = computed(() => {
  return state.registration?.toString().toUpperCase().replace(/\s+/g, '') || ''
})

watchDebounced(
  () => state.registration,
  async () => {
    if (!plateFormatted.value || plateFormatted.value.length < 2) {
      return
    }
    await execute()
  },
  { debounce: 500, maxWait: 1000 }
)

interface VehicleData {
  make: string
  model: string
  registrationDate: string
  engineSize: string
  fuelType: string
  primaryColour: string
}

const { data, status, execute } = await useFetch<VehicleData>(() => `/api/${plateFormatted.value}`, {
  pick: ['make', 'model', 'registrationDate', 'engineSize', 'fuelType', 'primaryColour'],
  immediate: false,
  watch: false,
  transform: (data) => {
    // Transform DVLA response to match expected fields
    return {
      make: data.make,
      model: data.model,
      registrationDate: `${useDateFormat(data.registrationDate, 'MMM').value} '${useDateFormat(data.registrationDate, 'YY').value}`,
      engineSize: data.engineSize === undefined ? ' --- cc' : `${data.engineSize}cc`,
      fuelType: data.fuelType,
      primaryColour: data.primaryColour
    }
  }
})

watchEffect(() => {
  if (data.value) {
    const { make, model, registrationDate, engineSize, fuelType, primaryColour } = data.value
    state.makeModel = `${make} ${model} ${registrationDate} ${fuelType} ${engineSize} ${primaryColour}`
  }
})

const toast = useToast()
async function onSubmit() {
  const stateWithFormName = Object.assign({ 'form-name': 'exhaustContact' }, state)
  const stateStringified = new URLSearchParams(stateWithFormName).toString()
  const query = stateStringified.replaceAll('undefined', '-')

  await $fetch('/', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    body: query
  }).then(() =>
    toast.add({ title: 'Success', description: 'Thank you. We\'ll be in touch soon', color: 'success' })
  ).catch(error =>
    toast.add({ title: 'Error', description: error.toString(), color: 'error' })
  )
}
</script>

<template>
  <div>
    <!-- <pre>{{ bearer }}</pre> -->

    <UForm
      id="exhaustContact"
      :schema="schema"
      :state="state"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      @submit.prevent="onSubmit"
    >
      <input
        type="hidden"
        name="form-name"
        value="exhaustContact"
      >
      <UPageColumns>
        <UFormField
          label="Name"
          name="name"
        >
          <UInput
            v-model="state.name"
            variant="subtle"
            color="primary"
            class="w-full"
            icon=""
          />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="state.email"
            variant="subtle"
            color="primary"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Telephone number"
          name="telephone"
        >
          <UInput
            v-model="state.telephone"
            variant="subtle"
            color="primary"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Car registration"
          name="registration"
        >
          <UInput
            v-model="state.registration"
            :value="plateFormatted"
            variant="subtle"
            color="primary"
            class="w-2/5"
            :ui="{ base: 'bg-yellow-300 font-bold text-black',
                   leading: 'ps-0'
            }"
          >
            <template #leading>
              <div
                class="flex flex-col items-center justify-center h-full p-1  text-yellow-300 font-bold rounded-l-sm"
                :class="data?.fuelType === 'Electric' ? 'bg-green-600' : 'bg-blue-800'"
              >
                <UIcon
                  name="i-flag-gb-4x3"
                />
                <span class="text-[0.6rem]">GB</span>
              </div>
            </template>
          </UInput>
        </UFormField>

        <UFormField
          label="Car make & model"
          name="makeModel"
        >
          <UInput
            v-model="state.makeModel"
            variant="subtle"
            color="primary"
            class="w-full"
            :loading="status === 'pending'"
          />
        </UFormField>

        <UFormField
          label="Postcode"
          name="postcode"
        >
          <UInput
            v-model="state.postcode"
            variant="subtle"
            color="primary"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Work required"
          name="workRequired"
        >
          <URadioGroup
            v-model="state.workRequired"
            variant="table"
            :items="workRequiredOptions"
            color="primary"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Additional notes"
          name="notes"
        >
          <UTextarea
            v-model="state.notes"
            :rows="4"
            placeholder="Your message or extra notes"
            variant="subtle"
            color="primary"
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          color="primary"
        >
          Submit
        </UButton>
      </UPageColumns>
    </UForm>
  </div>
</template>

<!-- <style scoped>
  .registration-ui {
  background: linear-gradient(to bottom, #f8d038 0%,#f5ca2e 100%);
  padding: .25em 1em .25em 1.75em;
  font-weight: bold;
  font-size: 2em;
  border-radius: 5px;
  border: 1px solid #000;
  box-shadow: 1px 1px 1px #ddd;
  position: relative;
  font-family: helvetica, ariel, sans-serif;
}

.registration-ui:before {
  content: 'GB';
  display: block;
  width: 30px;
  height: 100%;
  background: #063298;
  position: absolute;
  top: 0;
  border-radius: 5px 0 0 5px;
  color: #f8d038;
  font-size: .5em;
  line-height: 85px;
  padding-left: 5px;
}

.registration-ui:after {
  content: '';
  display: block;
  position: absolute;
  top: 7px;
  left: 5px;
  width: 20px;
  height: 20px;
  border-radius: 30px;
  border: 1px dashed #f8d038;
}
</style> -->
