<template>
  <div class="flex flex-1 overflow-hidden relative mt-[70px]">
    <!-- Sidebar: Question List -->
    <aside
      class="w-64 bg-[#161b22] border-r border-[#282e39] flex flex-col shrink-0 z-10 fixed left-0 h-screen overflow-hidden"
    >
      <div class="p-4 border-b border-[#282e39]">
        <button
          class="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary h-10 rounded-lg font-medium transition-colors"
          type="button"
          @click="addEmptyQuestion"
        >
          <Icon name="material-symbols-light:add-circle" class="text-[20px]" />
          Add Question
        </button>
      </div>
      <div class="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
        <!-- Active Question Item -->
        <button
          v-for="(question, index) in questions"
          :key="question.id"
          class="group w-full relative border flex flex-col gap-2 p-3 rounded-xl shadow-md cursor-pointer text-left"
          :class="
            question.id === selectedQuestion?.id
              ? '!bg-[#282e39] !border-primary/50'
              : 'bg-[#282e39]/50 border-[#3b4354]'
          "
          type="button"
          @click="selectedQuestion = question"
        >
          <div class="flex justify-between items-start mb-1">
            <span class="text-xs font-bold text-primary">Question {{ index + 1 }}</span>
            <button
              class="text-gray-400 hover:text-red-500 transition-colors"
              type="button"
              @click.stop="deleteQuestion(question.id)"
            >
              <Icon name="material-symbols-light:delete-outline" class="text-base" />
            </button>
          </div>
          <div class="text-sm font-medium text-white line-clamp-2">
            {{ question.question_text }}
          </div>
          <div class="flex gap-1 mt-2">
            <div
              class="h-1 flex-1 rounded-full bg-accent-red"
              :class="question.correct_answer === 'A' ? '' : 'opacity-20'"
            />
            <div
              class="h-1 flex-1 rounded-full bg-accent-blue"
              :class="question.correct_answer === 'B' ? '' : 'opacity-20'"
            />
            <div
              class="h-1 flex-1 rounded-full bg-accent-yellow"
              :class="question.correct_answer === 'C' ? '' : 'opacity-20'"
            />
            <div
              class="h-1 flex-1 rounded-full bg-accent-green"
              :class="question.correct_answer === 'D' ? '' : 'opacity-20'"
            />
          </div>
        </button>
      </div>
    </aside>
    <main
      class="flex-1 ml-64 flex flex-col h-full relative overflow-y-auto bg-cover bg-center"
      data-alt="Subtle dark geometric pattern background"
      style="
        background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuAYoDRwddJH4j81rdhquq67HUsPeTxTwPVxI9yqdb2AliKEtFqZgrGmFW1islnYQw3fWgJqoF7XT-PjIg8j3LxjNq9FOgQQFyIx1azkP1Hf1TL6FglGrMNUVJPahHdZFhaq2bs7iGzVBCor3ocK_sHRpGYQ5aUmbCcPjreUonp_mRY2iCW1fn4rjYXb6BmC_u9bLHC0KbShjmp-k-bNXVqRgEpn7F5Rtakr-reyM0RInvPHYqQthQpgoapJWmRzj3hNhHA9GS_w1Cbk');
      "
    >
      <!-- Overlay to darken bg image -->
      <div class="absolute inset-0 bg-[#111318]/95 z-0" />
      <div
        v-if="selectedQuestion"
        class="relative z-10 flex flex-col w-full max-w-[1024px] mx-auto p-8 pb-32 h-full"
      >
        <!-- Question Number -->
        <div class="text-center mb-6">
          <h2 class="text-2xl font-bold text-white mb-2">Question</h2>
        </div>
        <!-- Question Input Area -->
        <div class="glass-panel rounded-2xl p-6 mb-6 shadow-xl">
          <div class="flex flex-col gap-4">
            <textarea
              v-model="selectedQuestion.question_text"
              class="w-full bg-transparent border-none text-center text-3xl font-bold text-white placeholder-gray-600 focus:ring-0 resize-none min-h-[80px] leading-tight"
              placeholder="Start typing your question here..."
            />
            <div class="flex items-center justify-center gap-6 mt-2 pt-6 border-t border-white/5">
              <!-- Time Limit -->
              <div class="flex flex-col gap-2 items-center">
                <span class="text-xs uppercase tracking-wider font-bold text-gray-500"
                  >Time Limit</span
                >
                <div class="flex p-1 bg-[#282e39] rounded-lg">
                  <button
                    v-for="limit in timeLimits"
                    :key="limit"
                    class="px-3 py-1.5 text-sm font-medium rounded-md"
                    :class="
                      selectedQuestion.time_limit === limit
                        ? 'bg-primary text-white'
                        : 'text-gray-400 hover:text-white'
                    "
                    @click="selectedQuestion.time_limit = limit as 10 | 20 | 30 | 60"
                  >
                    {{ limit + 's' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Answer Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-[300px]">
          <!-- Answer A (Red) -->
          <button
            class="answer-card-red group relative flex items-center bg-[#282e39] rounded-xl border-l-8 border-accent-red p-2 transition-all duration-200"
            :class="selectedQuestion.correct_answer === 'A' ? 'ring-2 ring-accent-red/50' : ''"
            type="button"
            @click="selectedQuestion.correct_answer = 'A'"
          >
            <div
              class="bg-accent-red/10 flex items-center justify-center size-10 rounded-lg mr-3 shrink-0"
            >
              <Icon name="material-symbols-light:change-history" class="text-accent-red" />
            </div>
            <input
              v-model="selectedQuestion.option_a"
              class="flex-1 bg-transparent border-none text-lg font-semibold text-white focus:ring-0 placeholder-gray-500"
              placeholder="Add answer 1"
              type="text"
            />
            <div
              v-if="selectedQuestion.correct_answer === 'A'"
              class="size-8 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Icon name="material-symbols-light:check" class="text-white" />
            </div>
          </button>
          <!-- Answer B (Blue) -->
          <button
            class="answer-card-blue group relative flex items-center bg-[#282e39] rounded-xl border-l-8 border-accent-blue p-2 transition-all duration-200"
            :class="selectedQuestion.correct_answer === 'B' ? 'ring-2 ring-accent-blue/50' : ''"
            type="button"
            @click="selectedQuestion.correct_answer = 'B'"
          >
            <div
              class="bg-accent-blue/10 flex items-center justify-center size-10 rounded-lg mr-3 shrink-0"
            >
              <Icon name="material-symbols-light:diamond" class="text-accent-blue" />
            </div>
            <input
              v-model="selectedQuestion.option_b"
              class="flex-1 bg-transparent border-none text-lg font-semibold text-white focus:ring-0 placeholder-gray-500"
              placeholder="Add answer 2"
              type="text"
            />
            <div
              v-if="selectedQuestion.correct_answer === 'B'"
              class="size-8 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Icon name="material-symbols-light:check" class="text-white" />
            </div>
          </button>
          <!-- Answer C (Yellow) -->
          <button
            class="answer-card-yellow group relative flex items-center bg-[#282e39] rounded-xl border-l-8 border-accent-yellow p-2 transition-all duration-200 ring-offset-2 ring-offset-[#111318]"
            :class="selectedQuestion.correct_answer === 'C' ? 'ring-2 ring-accent-yellow/50' : ''"
            type="button"
            @click="selectedQuestion.correct_answer = 'C'"
          >
            <div
              class="bg-accent-yellow/10 flex items-center justify-center size-10 rounded-lg mr-3 shrink-0"
            >
              <Icon name="material-symbols-light:circle" class="text-accent-yellow" />
            </div>
            <input
              v-model="selectedQuestion.option_c"
              class="flex-1 bg-transparent border-none text-lg font-semibold text-white focus:ring-0 placeholder-gray-500"
              placeholder="Add answer 3"
              type="text"
            />
            <div
              v-if="selectedQuestion.correct_answer === 'C'"
              class="size-8 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Icon name="material-symbols-light:check" class="text-white" />
            </div>
          </button>
          <!-- Answer D (Green) -->
          <button
            class="answer-card-green group relative flex items-center bg-[#282e39] rounded-xl border-l-8 border-accent-green p-2 transition-all duration-200"
            :class="selectedQuestion.correct_answer === 'D' ? 'ring-2 ring-accent-green/50' : ''"
            type="button"
            @click="selectedQuestion.correct_answer = 'D'"
          >
            <div
              class="bg-accent-green/10 flex items-center justify-center size-10 rounded-lg mr-3 shrink-0"
            >
              <Icon name="material-symbols-light:square" class="text-accent-green" />
            </div>
            <input
              v-model="selectedQuestion.option_d"
              class="flex-1 bg-transparent border-none text-lg font-semibold text-white focus:ring-0 placeholder-gray-500"
              placeholder="Add answer 4"
              type="text"
            />
            <div
              v-if="selectedQuestion.correct_answer === 'D'"
              class="size-8 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Icon name="material-symbols-light:check" class="text-white" />
            </div>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCreateGame } from '~/composables/game/create'

const { questions, selectedQuestion, addEmptyQuestion, deleteQuestion } = useCreateGame()
const timeLimits = [10, 20, 30, 60]
</script>

<style scoped>
input,
textarea {
  outline: none;
  border: none;
}
</style>
