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

const plate = ref('')

function sanitisePlate(rawPlate: string | undefined) {
  if (!rawPlate || rawPlate.length < 2) {
    return
  }
  plate.value = rawPlate.toString().toUpperCase().replace(/\s+/g, '')
}

watchDebounced(
  state,
  () => { sanitisePlate(state.registration) },
  { debounce: 500, maxWait: 1000 }
)

// const { data, status, error, refresh, clear } = await useFetch(() => `/api/dvla/${plate.value}`, {
//   pick: ['make', 'monthOfFirstRegistration', 'yearOfManufacture', 'engineCapacity', 'fuelType']
// })

interface VehicleData {
  make: string
  model: string
  registrationDate: string
  engineSize: string
  fuelType: string
  primaryColour: string
}

const { data, status } = await useFetch<VehicleData>(() => `/api/${plate.value}`, {
  pick: ['make', 'model', 'registrationDate', 'engineSize', 'fuelType', 'primaryColour'],
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
            variant="subtle"
            color="primary"
            class="w-full"
          />
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
