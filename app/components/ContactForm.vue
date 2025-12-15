<script setup lang="ts">
import * as z from 'zod/v4'
import type { FormSubmitEvent } from '@nuxt/ui'

const schema = z.object({
  name: z.string('Name is required').nonempty('Name is required'),  
  email: z.email('Invalid email'),
  telephone: z.string().optional(),
  makeModel: z.string().optional(),
  registration: z.string().optional(),
  postcode: z.string().optional(),
  workRequired: z.enum(['Cat-Back', 'Mani-Back', 'Back-Box Only', 'Tailpipes Only', 'Full System', 'Full System with Remap', 'Other (please specify in notes)']).optional(),
  notes: z.string().optional(),
  contactPreference: z.enum(['email', 'phone', 'sms']).optional()
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
  toast.add({ title: 'Success', description: 'The form has been submitted.', color: 'success' })
  console.log(event.data)
}
</script>

<template>
    
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit" netlify>
    <UPageColumns>
    <UFormField label="Name" name="name">
      <UInput v-model="state.name" />
    </UFormField>

    <UFormField label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormField>

    <UFormField label="Telephone number" name="telephone">
      <UInput v-model="state.telephone" />
    </UFormField>

    <UFormField label="Car make & model" name="makeModel">
      <UInput v-model="state.makeModel" />
    </UFormField>

    <UFormField label="Car registration" name="registration">
      <UInput v-model="state.registration" />
    </UFormField>

    <UFormField label="Postcode" name="postcode">
      <UInput v-model="state.postcode" />
    </UFormField>

    <UFormField label="Work required" name="workRequired" >
      <USelect
        v-model="state.workRequired"
        :items="[
          'Cat-Back',
          'Mani-Back',
          'Back-Box Only',
          'Tailpipes Only',
          'Full System',
          'Full System with Remap',
          'Other (please specify in notes)'
        ]"
        placeholder="Work required"
        class="w-48"
      />
    </UFormField>

    <UFormField label="Preferred contact method" name="contactPreference" >
      <USelect
        v-model="state.contactPreference"
        :items="['Email', 'Phone', 'SMS']"
        placeholder="Contact preference"
        class="w-48"
      />
    </UFormField>

    <UFormField label="Additional notes" name="notes">
      <UTextarea v-model="state.notes" :rows="4" />
    </UFormField>

    <UButton type="submit">
      Submit
    </UButton>
    </UPageColumns>
  </UForm>
</template>

