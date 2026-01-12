<template>
  <div>
    <Toaster position="top-right" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>


<script lang="ts" setup>
import { Toaster } from 'vue-sonner'
import 'vue-sonner/style.css'
</script>