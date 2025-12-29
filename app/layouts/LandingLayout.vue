<template>
  <main
    class="w-full min-h-screen bg-background-dark text-white font-display overflow-x-hidden antialiased selection:bg-primary selection:text-white"
  >
    <div class="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div
        class="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"
      />
      <div
        class="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]"
      />
    </div>
    <slot />
  </main>
</template>

<script setup lang="ts"></script>
