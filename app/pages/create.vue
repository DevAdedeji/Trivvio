<template>
  <main
    class="w-full h-screen relative bg-background-dark font-display overflow-x-hidden antialiased text-white"
  >
    <!-- Header -->
    <header
      class="fixed bg-background-dark left-0 right-0 w-full flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-800 px-6 py-4 lg:px-10 z-50"
    >
      <div class="flex items-center gap-4">
        <button
          class="flex items-center justify-center text-slate-400 hover:text-primary transition-colors"
        >
          <Icon name="material-symbols-light:arrow-back" />
        </button>
        <h2 class="hidden md:block text-lg font-bold leading-tight tracking-[-0.015em]">
          Create New Game
        </h2>
        <h2 class="md:hidden block text-lg font-bold leading-tight tracking-[-0.015em]">Create</h2>
      </div>
      <div class="flex items-center gap-6">
        <button
          class="text-sm font-medium leading-normal text-slate-400 hover:text-white transition-colors"
          href="#"
        >
          Cancel
        </button>
        <button
          class="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 bg-primary hover:bg-blue-600 transition-colors text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-lg shadow-blue-900/20"
          :disabled="disableNextBtn"
        >
          <span class="truncate">Next</span>
        </button>
      </div>
    </header>
    <!--  -->
    <div class="flex flex-1 justify-center py-8 px-4 sm:px-8 mt-20">
      <div class="flex flex-col max-w-[960px] flex-1 w-full">
        <!-- Progress Bar -->
        <div class="flex flex-col gap-3 px-4 py-2">
          <div class="flex gap-6 justify-between items-end">
            <p class="text-sm font-medium leading-normal text-slate-400">Step 1 of 4</p>
          </div>
          <div class="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
            <div class="h-full bg-primary rounded-full" style="width: 25%" />
          </div>
        </div>
        <FirstStep />
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import FirstStep from '~/components/create/FirstStep.vue'
import { useCreateGame } from '~/composables/game/create'
const { currentStep, selectedAmountOfQuestions } = useCreateGame()

const disableNextBtn = computed(() => {
  if (currentStep.value === 1) {
    if (selectedAmountOfQuestions.value) {
      return false
    }
  }
  return true
})
</script>
