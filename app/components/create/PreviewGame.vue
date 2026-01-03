<template>
  <div v-if="loading" class="px-4 py-8 pb-32 w-full max-w-[1000px] mx-auto">
    <section class="w-full mb-10 rounded-xl overflow-hidden p-1 shadow-lg">
      <div
        class="bg-[#1a2230] rounded-lg overflow-hidden p-8 md:p-10 flex flex-col items-center justify-center text-center animate-pulse"
      >
        <div class="h-10 md:h-12 w-64 md:w-80 rounded-lg bg-slate-700 mb-4" />

        <div class="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-700/50">
          <div class="h-5 w-5 rounded-full bg-slate-600" />
          <div class="h-5 w-28 rounded-md bg-slate-600" />
        </div>
      </div>
    </section>
  </div>
  <div v-else-if="!loading && gamePreview" class="px-4 py-8 pb-32 w-full max-w-[1000px] mx-auto">
    <section class="w-full mb-10 glass-card rounded-xl overflow-hidden p-1 shadow-lg">
      <div
        class="bg-[#1a2230] header-gradient rounded-lg overflow-hidden p-8 md:p-10 flex flex-col items-center justify-center text-center relative"
      >
        <h3
          class="text-4xl md:text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white drop-shadow-sm"
        >
          {{ gamePreview.title }}
        </h3>
        <div
          class="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm"
        >
          <Icon name="material-symbols-light:quiz" class="text-primary text-xl" />
          <span class="text-lg font-bold text-primary"
            >{{ gamePreview.question_count }} Questions</span
          >
        </div>
      </div>
    </section>
    <div class="w-full flex justify-between items-center mb-6">
      <h3 class="text-xl font-bold text-white flex items-center gap-2">
        <Icon name="material-symbols-light:list" class="text-primary" />
        Questions Review
      </h3>
    </div>
    <div class="w-full flex flex-col gap-5">
      <div
        v-for="question in gamePreview.questions"
        :key="question.id"
        class="group relative bg-[#1a2230] border border-gray-800 rounded-xl px-3 py-6 sm:p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/50"
      >
        <div class="sm:pl-4">
          <div class="flex justify-between items-start mb-4">
            <div class="flex gap-4">
              <div
                class="size-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center font-bold text-sm text-gray-500"
              >
                {{ question.order_index }}
              </div>
              <div>
                <h4 class="text-lg font-semibold leading-snug">
                  {{ question.question_text }}
                </h4>
              </div>
            </div>
          </div>
          <!-- Answers Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 pl-12">
            <!-- Option A -->
            <div
              class="p-3 rounded-lg text-sm flex items-center gap-3"
              :class="
                question.correct_answer === 'A'
                  ? 'border border-primary bg-primary/10 font-medium text-white shadow-[0_0_15px_rgba(13,89,242,0.15)]'
                  : 'border border-gray-700 bg-gray-800/50 text-gray-500'
              "
            >
              <div
                v-if="question.correct_answer !== 'A'"
                class="size-6 rounded flex items-center justify-center bg-gray-700 text-base font-bold"
              >
                <Icon name="material-symbols-light:change-history" />
              </div>
              <div
                v-else
                class="size-6 rounded flex items-center justify-center bg-primary text-white text-xs font-bold"
              >
                <Icon name="material-symbols-light:check" class="text-sm" />
              </div>
              {{ question.option_a }}
            </div>
            <!-- Option B -->
            <div
              class="p-3 rounded-lg text-sm flex items-center gap-3"
              :class="
                question.correct_answer === 'B'
                  ? 'border border-primary bg-primary/10 font-medium text-white shadow-[0_0_15px_rgba(13,89,242,0.15)]'
                  : 'border border-gray-700 bg-gray-800/50 text-gray-500'
              "
            >
              <div
                v-if="question.correct_answer !== 'B'"
                class="size-6 rounded flex items-center justify-center bg-gray-700 text-base font-bold"
              >
                <Icon name="material-symbols-light:diamond" />
              </div>
              <div
                v-else
                class="size-6 rounded flex items-center justify-center bg-primary text-white text-xs font-bold"
              >
                <Icon name="material-symbols-light:check" class="text-sm" />
              </div>
              {{ question.option_b }}
            </div>
            <!-- Option C -->
            <div
              class="p-3 rounded-lg text-sm flex items-center gap-3"
              :class="
                question.correct_answer === 'C'
                  ? 'border border-primary bg-primary/10 font-medium text-white shadow-[0_0_15px_rgba(13,89,242,0.15)]'
                  : 'border border-gray-700 bg-gray-800/50 text-gray-500'
              "
            >
              <div
                v-if="question.correct_answer !== 'C'"
                class="size-6 rounded flex items-center justify-center bg-gray-700 text-base font-bold"
              >
                <Icon name="material-symbols-light:circle" />
              </div>
              <div
                v-else
                class="size-6 rounded flex items-center justify-center bg-primary text-white text-xs font-bold"
              >
                <Icon name="material-symbols-light:check" class="text-sm" />
              </div>
              {{ question.option_c }}
            </div>
            <!-- Option D -->
            <div
              class="p-3 rounded-lg text-sm flex items-center gap-3"
              :class="
                question.correct_answer === 'D'
                  ? 'border border-primary bg-primary/10 font-medium text-white shadow-[0_0_15px_rgba(13,89,242,0.15)]'
                  : 'border border-gray-700 bg-gray-800/50 text-gray-500'
              "
            >
              <div
                v-if="question.correct_answer !== 'D'"
                class="size-6 rounded flex items-center justify-center bg-gray-700 text-base font-bold"
              >
                <Icon name="material-symbols-light:square" />
              </div>
              <div
                v-else
                class="size-6 rounded flex items-center justify-center bg-primary text-white text-xs font-bold"
              >
                <Icon name="material-symbols-light:check" class="text-sm" />
              </div>
              {{ question.option_d }}
            </div>
          </div>
          <!-- Footer Meta -->
          <div class="flex items-center gap-4 pl-12">
            <div
              class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-500"
            >
              <Icon name="material-symbols-light:timer" class="text-sm" />{{ question.time_limit }}s
            </div>
            <div
              class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-500"
            >
              <Icon name="material-symbols-light:trophy" class="text-sm" /> 100 pts
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePreviewGame } from '~/composables/game/preview'

const { loading, gamePreview } = usePreviewGame()
</script>
