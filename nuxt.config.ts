export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,
  app: {
    head: {
      title: 'Trivvio',
      titleTemplate: '%s - Trivvio',
      htmlAttrs: {
        lang: 'en',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Create, play, and compete in exciting trivia games with Trivvio. The ultimate platform for quiz enthusiasts.' },
        { name: 'theme-color', content: '#0f172a' },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://trivvio.adedeji.xyz/' },
        { property: 'og:title', content: 'Trivvio - The Ultimate Trivia Game' },
        { property: 'og:description', content: 'Create, play, and compete in exciting trivia games with Trivvio. The ultimate platform for quiz enthusiasts.' },
        { property: 'og:image', content: '/screenshot.png' },

        // Twitter
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:url', content: 'https://trivvio.adedeji.xyz/' },
        { property: 'twitter:title', content: 'Trivvio - The Ultimate Trivia Game' },
        { property: 'twitter:description', content: 'Create, play, and compete in exciting trivia games with Trivvio. The ultimate platform for quiz enthusiasts.' },
        { property: 'twitter:image', content: '/screenshot.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  devServer: {
    port: 8080,
  },
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon', '@nuxtjs/supabase', '@nuxtjs/tailwindcss'],
  css: ['/assets/css/main.css'],
  supabase: {
    redirect: false,
  },
})
