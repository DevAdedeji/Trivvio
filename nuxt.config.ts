// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {
      title: 'Trivvio',
      htmlAttrs: {
        lang: 'en',
      },
    },
  },
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
  css: ['/assets/css/main.css'],
  supabase: {
    redirect: false,
  },
})
