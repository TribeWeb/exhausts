<script setup lang="ts">
const nuxtApp = useNuxtApp()
const { activeHeadings, updateHeadings } = useScrollspy()

const colorMode = useColorMode()

const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set(_isDark) {
    colorMode.preference = _isDark ? 'dark' : 'light'
  }
})

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
  label: 'Contact',
  to: '#contact',
  active: activeHeadings.value.includes('contact') && !activeHeadings.value.includes('about')
}])

nuxtApp.hooks.hookOnce('page:finish', () => {
  updateHeadings([
    document.querySelector('#features'),
    document.querySelector('#about'),
    document.querySelector('#testimonials'),
    document.querySelector('#contact')
  ].filter(Boolean) as Element[])
})
</script>

<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/">
        <div class="flex flex-row gap-1.5">
          <div class="flex flex-col font-feature font-bold text-3xl leading-none text-primary">
            DeMarco
            <div class="text-default text-xs font-light font-sans tracking-[0.56em]">
              EXHAUSTS
            </div>
          </div>
        </div>
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

      <!-- <UColorModeButton /> -->
      <ClientOnly v-if="!colorMode?.forced">
        <UButton
          :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
          color="neutral"
          variant="ghost"
          :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
          @click="isDark = !isDark"
        />

        <template #fallback>
          <div class="size-8" />
        </template>
      </ClientOnly>
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
