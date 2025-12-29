<template>
  <div>
    <!-- Headline -->
    <div class="px-4 py-6 text-center">
      <h1
        class="text-3xl md:text-5xl font-bold leading-tight tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent pb-2"
      >
        How many questions?
      </h1>
      <p class="text-slate-400 mt-2 text-lg">Select the length of your trivia challenge.</p>
    </div>
    <!-- Selection Grid -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 mt-4">
      <button
        v-for="amount in amount_of_questions"
        :key="amount.id"
        class="relative flex flex-col items-center justify-center aspect-[4/5] md:aspect-square rounded-xl p-6 cursor-pointer transition-all duration-300"
        :class="
          selectedAmountOfQuestions === amount.count
            ? 'border-2 border-primary bg-primary/10 shadow-[0_0_30px_-10px_rgba(13,89,242,0.4)]'
            : 'border border-slate-700 bg-slate-800/40 hover:border-primary hover:shadow-[0_0_30px_-10px_rgba(13,89,242,0.3)] hover:-translate-y-1'
        "
        type="button"
        @click="selectedAmountOfQuestions = amount.count"
      >
        <div
          v-if="selectedAmountOfQuestions === amount.count"
          class="absolute top-3 right-3 text-primary"
        >
          <Icon name="material-symbols-light:check-circle" />
        </div>
        <div
          class="mb-2 rounded-full bg-primary size-14 text-white flex items-center justify-center"
        >
          <Icon :name="amount.icon" class="text-3xl" />
        </div>
        <span
          class="text-5xl font-extrabold tracking-tighter transition-colors group-hover:text-primary"
          :class="selectedAmountOfQuestions === amount.count ? 'text-primary' : 'text-white'"
          >{{ amount.count }}</span
        >
        <p class="mt-2 text-sm font-bold text-primary">{{ amount.text }}</p>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCreateGame } from '~/composables/game/create'
const { amount_of_questions, selectedAmountOfQuestions } = useCreateGame()
</script>
