<template>
  <main class="flex h-screen items-center justify-center p-4 relative z-10">
    <div class="flex flex-col gap-4">
      <p class="text-slate-400 text-base font-medium leading-relaxed max-w-[320px] mx-auto">
        Please do not refresh the page, signing you in....
      </p>
    </div>
  </main>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'landing-layout',
})

const client = useSupabaseClient()

await client.auth.exchangeCodeForSession(window.location.href)

navigateTo('/create')
</script>
