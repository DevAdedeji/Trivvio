<template>
  <div class="flex flex-col h-full w-full max-w-4xl mx-auto p-6 md:px-8 md:py-8 md:pb-16 gap-8 relative z-10 font-sans">
    <!-- Header / Timer -->
    <div class="flex items-center justify-between text-slate-400 text-xs font-bold tracking-widest uppercase">
      <div class="flex items-center gap-2">
         <span class="relative flex h-2 w-2 ml-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
         </span>
         <span class="text-green-500">LIVE</span>
      </div>

      <!-- Progress -->
      <span class="text-slate-500">
        Question {{ questionIndex + 1 }} / {{ totalQuestions }}
      </span>

      <span>{{ timeRemaining }}s</span>
    </div>

    <!-- Timer Bar -->
    <div class="relative h-2 bg-slate-800 rounded-full overflow-hidden w-full">
      <div
        class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-linear"
        :style="{ width: `${(timeRemaining / (question.time_limit || 20)) * 100}%` }"
      />
    </div>

    <!-- Question Text -->
    <div class="flex-grow flex items-center justify-center text-center py-8">
      <h1 class="text-3xl md:text-5xl font-black text-white leading-tight">
        <span> {{ props.question.question_text }} </span>
      </h1>
    </div>

    <!-- Options Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mt-auto">
      <button
        v-for="(option, key) in options"
        :key="key"
        @click="handleAnswer(key)"
        :disabled="hasAnswered || isHost"
        class="group relative h-24 md:h-32 rounded-2xl flex items-center px-6 md:px-8 transition-all duration-200 transform active:scale-[0.98] outline-none disabled:cursor-not-allowed disabled:opacity-80"
        :class="[
          getOptionColor(key),
          hasAnswered && selectedAnswer === key ? 'ring-4 ring-white ring-opacity-50 scale-[0.98]' : (hasAnswered || isHost ? '' : 'hover:-translate-y-1 hover:shadow-xl'),
          (hasAnswered || isHost) ? 'opacity-90' : '',
          (hasAnswered && selectedAnswer !== key) ? 'opacity-50 grayscale' : ''
        ]"
      >
        <!-- Icon/Shape -->
        <div class="size-10 md:size-12 rounded-lg md:rounded-xl bg-black/20 flex items-center justify-center mr-4 md:mr-6 text-white shrink-0">
          <Icon :name="getOptionIcon(key)" class="text-xl md:text-2xl" />
        </div>

        <!-- Text -->
        <span class="text-lg md:text-2xl font-bold text-white text-left leading-tight line-clamp-2">
          {{ option }}
        </span>

        <!-- Host/Answered View: Answer Count -->
        <div v-if="isHost" class="absolute top-2 right-2 md:top-4 md:right-4 bg-black/40 px-3 py-1 rounded-full text-sm font-black text-white backdrop-blur-sm">
          {{ answerCounts?.[getOptionLetter(key)] || 0 }}
        </div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'

const props = defineProps<{
  question: Database['public']['Tables']['questions']['Row']
  isHost: boolean
  timeRemaining: number
  answerCounts?: Record<string, number>
  totalAnswers?: number
  totalPlayers?: number
  questionIndex: number
  totalQuestions: number
}>()

const emit = defineEmits<{
  (e: 'answer', optionKey: string): void
}>()

const selectedAnswer = ref<string | null>(null)
const hasAnswered = computed(() => !!selectedAnswer.value)

const options = computed(() => ({
  option_a: props.question.option_a,
  option_b: props.question.option_b,
  option_c: props.question.option_c,
  option_d: props.question.option_d,
}))

const handleAnswer = (key: string) => {
  if (props.isHost || hasAnswered.value) return
  selectedAnswer.value = key
  emit('answer', key)
}

const getOptionColor = (key: string) => {
  switch (key) {
    case 'option_a': return 'bg-[#ef4444] shadow-lg shadow-red-500/20' // Red
    case 'option_b': return 'bg-[#3b82f6] shadow-lg shadow-blue-500/20' // Blue
    case 'option_c': return 'bg-[#eab308] shadow-lg shadow-yellow-500/20' // Yellow
    case 'option_d': return 'bg-[#22c55e] shadow-lg shadow-green-500/20' // Green
    default: return 'bg-slate-700'
  }
}

const getOptionIcon = (key: string) => {
  switch (key) {
    case 'option_a': return 'material-symbols-light:change-history-rounded' // Triangle
    case 'option_b': return 'material-symbols-light:diamond-rounded' // Diamond
    case 'option_c': return 'material-symbols-light:circle' // Circle
    case 'option_d': return 'material-symbols-light:square-rounded' // Square
    default: return 'material-symbols-light:circle'
  }
}

const getOptionLetter = (key: string) => {
  const map: Record<string, string> = {
    'option_a': 'A',
    'option_b': 'B',
    'option_c': 'C',
    'option_d': 'D'
  }
  return map[key] || key
}

</script>
