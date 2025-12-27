<template>
  <div>
    <HeroSection />
    <HowItWorks />
    <ShowCase />
    <Features />
    <Footer />
  </div>
</template>

<script setup lang="ts">
import Features from '~/components/landing/Features.vue'
import Footer from '~/components/landing/Footer.vue'
import HeroSection from '~/components/landing/HeroSection.vue'
import HowItWorks from '~/components/landing/HowItWorks.vue'
import ShowCase from '~/components/landing/ShowCase.vue'

definePageMeta({
  layout: 'landing-layout',
})
</script>
