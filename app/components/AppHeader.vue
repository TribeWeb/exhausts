<script setup lang="ts">
const nuxtApp = useNuxtApp()
const { activeHeadings, updateHeadings } = useScrollspy()

const items = computed(() => [{
  label: 'Features',
  to: '#features',
  active: activeHeadings.value.includes('features') && !activeHeadings.value.includes('about')
}, {
  label: 'About',
  to: '#about',
  active: activeHeadings.value.includes('about')
}, {
  label: 'Testimonials',
  to: '#testimonials',
  active: activeHeadings.value.includes('testimonials') && !activeHeadings.value.includes('about')
}, {
  label: 'Quote',
  to: '#quote',
  active: activeHeadings.value.includes('quote') && !activeHeadings.value.includes('about')
}])

nuxtApp.hooks.hookOnce('page:finish', () => {
  updateHeadings([
    document.querySelector('#features'),
    document.querySelector('#about'),
    document.querySelector('#testimonials'),
    document.querySelector('#quote')
  ].filter(Boolean) as Element[])
})
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <!-- <AppLogo class="w-auto h-6 shrink-0" /> -->
        <span class="w-auto h-6 shrink-0">DeMarco Exhausts</span>
      </NuxtLink>
    </template>

    <template #right>
      <UNavigationMenu
        :items="items"
        variant="link"
        class="hidden lg:block"
      />

      <UButton
        label="03300 430467"
        href="tel:+443300430467"
        variant="subtle"
        class="hidden lg:block"
      />

      <UColorModeButton />
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
      <UButton
        class="mt-4"
        label="03300 430467"
        href="tel:+443300430467"
        variant="subtle"
        block
      />
    </template>
  </UHeader>
</template>
