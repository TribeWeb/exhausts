<script setup lang="ts">
// const columns = [{
//   label: 'Resources',
//   children: [{
//     label: 'Help center'
//   }, {
//     label: 'Docs'
//   }, {
//     label: 'Roadmap'
//   }, {
//     label: 'Changelog'
//   }]
// }, {
//   label: 'Features',
//   children: [{
//     label: 'Affiliates'
//   }, {
//     label: 'Portal'
//   }, {
//     label: 'Jobs'
//   }, {
//     label: 'Sponsors'
//   }]
// }, {
//   label: 'Company',
//   children: [{
//     label: 'About'
//   }, {
//     label: 'Pricing'
//   }, {
//     label: 'Careers'
//   }, {
//     label: 'Blog'
//   }]
// }]

// const toast = useToast()

// const email = ref('')
// const loading = ref(false)

// function onSubmit() {
//   loading.value = true

//   toast.add({
//     title: 'Subscribed!',
//     description: 'You\'ve been subscribed to our newsletter.'
//   })
// }
</script>

<template>
  <USeparator
    icon="i-lucide-settings"
    class="h-px"
  />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <!-- <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <form @submit.prevent="onSubmit">
              <UFormField
                name="email"
                label="Subscribe to our newsletter"
                size="lg"
              >
                <UInput
                  v-model="email"
                  type="email"
                  class="w-full"
                  placeholder="Enter your email"
                >
                  <template #trailing>
                    <UButton
                      type="submit"
                      size="xs"
                      label="Subscribe"
                    />
                  </template>
                </UInput>
              </UFormField>
            </form>
          </template>
        </UFooterColumns>
      </UContainer>
    </template> -->

    <template #left>
      <p class="text-sm text-muted">
        © {{ new Date().getFullYear() }} • DeMarco Exhausts
      </p>
    </template>

    <template #right>
      <UButton
        color="neutral"
        variant="ghost"
        to="https://tribeweb.co.uk"
        label="Site by TribeWeb"
      />
    </template>
  </UFooter>
</template>
