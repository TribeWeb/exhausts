<script setup lang="ts">
import * as z from 'zod/v4'
import type { FormSubmitEvent, RadioGroupItem } from '@nuxt/ui'

const frameworks = ref([
  'React',
  'VueJS',
  'Angular',
  'Svelte',
  'Ember',
  'Electron'
])

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
    label: 'Back-Box Only',
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
  email: z.email('Invalid email'),
  telephone: z.string().optional(),
  makeModel: z.string().optional(),
  registration: z.string().optional(),
  postcode: z.string().optional(),
  workRequired: z.enum(['catBack', 'maniBack', 'backBoxOnly', 'tailpipesOnly', 'fullSystem', 'fullSystemWithRemap', 'other']).optional(),
  notes: z.string().optional(),
  contactPreference: z.enum(['Email', 'Phone', 'SMS']).optional()
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
  notes: undefined,
  contactPreference: undefined
})

const toast = useToast()
async function onSubmit(event: FormSubmitEvent<Schema>) {
  function encode(data: Record<string, string>) {
    return Object.keys(data).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key] ?? '')).join('&')
  }
  //   const myForm = event.target
  //   const formData = new FormData(myForm)

  //   fetch('/', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  //     body: new URLSearchParams(formData).toString()
  //   })
  //     .then(() => console.log('Form successfully submitted'))
  //     .catch(error => alert(error))

  const bob = await $fetch('/', {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    method: 'POST',
    body: encode(event.data)
  })
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data, bob)
}
</script>

<template>
  <form
    action="/"
    method="post"
    enctype="application/x-www-form-urlencoded"
    data-netlify="true"
    name="framework-votes"
  >
    <input
      type="hidden"
      name="form-name"
      value="framework-votes"
    >
    <fieldset>
      <label for="name">
        <p>
          Your Name:
        </p>
        <input
          id="name"
          type="text"
          name="name"
          required
        >
      </label>
      <label for="name">
        <p>
          Your Role:
        </p>
        <select
          id="occupation"
          name="occupation"
          required
        >
          <option
            disabled
            selected
          >Select...</option>
          <option value="front-end-developer">Front-end Developer</option>
          <option value="full-stack-developer">Full-stack Developer</option>
          <option value="web-designer">Web Designer</option>
          <option value="project-manager">Project Manager</option>
        </select>
      </label>
    </fieldset>
    <fieldset>
      <label
        v-for="framework of frameworks"
        :key="framework"
        :for="framework"
      >
        <p>{{ framework }}</p>
        <input
          :id="framework"
          type="radio"
          name="framework"
          :value="framework"
          required
        >
      </label>
    </fieldset>
    <UButton type="submit">
      Submit
    </UButton>
  </form>
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
        label="Car make & model"
        name="makeModel"
      >
        <UInput
          v-model="state.makeModel"
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
        label="Preferred contact method"
        name="contactPreference"
        variant="subtle"
        color="primary"
        class="w-full"
      >
        <URadioGroup
          v-model="state.contactPreference"
          variant="table"
          :items="['Email', 'Phone', 'SMS']"
          color="primary"
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
</template>
