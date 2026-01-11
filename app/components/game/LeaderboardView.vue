<template>
  <div class="flex flex-col h-full w-full max-w-2xl mx-auto p-6 md:p-8 gap-8 relative z-10 font-sans items-center justify-center">

    <div class="text-center space-y-2">
      <h2 class="text-xs font-bold tracking-widest text-slate-400 uppercase">Leaderboard</h2>
      <h1 class="text-4xl font-black text-white">Top Players</h1>
    </div>

    <!-- Top 5 List -->
    <div class="w-full flex flex-col gap-3">
      <div
        v-for="(player, index) in topPlayers"
        :key="player.id"
        class="bg-[#1b1f27] border border-slate-700/50 rounded-xl p-4 flex items-center gap-4 transition-all hover:bg-[#232933]"
      >
        <div class="flex items-center justify-center size-8 font-bold text-slate-500 text-sm">
          #{{ index + 1 }}
        </div>

        <div class="size-10 rounded-full bg-slate-700 overflow-hidden shrink-0">
           <img
              v-if="player.avatar_url"
              :src="player.avatar_url"
              :alt="player.display_name"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">
              {{ player.display_name.charAt(0) }}
            </div>
        </div>

        <div class="flex-grow">
          <h3 class="font-bold text-white text-lg leading-none">{{ player.display_name }}</h3>
          <p class="text-xs text-slate-500 mt-1" v-if="player.current_streak > 2">
            🔥 {{ player.current_streak }} Streak
          </p>
        </div>

        <div class="text-right">
          <div class="font-black text-xl text-blue-400">{{ player.total_score }}</div>
          <div class="text-[10px] uppercase font-bold text-slate-600">Points</div>
        </div>
      </div>
    </div>

    <!-- Host Actions -->
    <div v-if="isHost" class="mt-8 flex gap-4">
      <button
        @click="$emit('next')"
        v-if="!isLastQuestion"
        class="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-lg flex items-center gap-3"
      >
        <span>Next Question</span>
        <Icon name="material-symbols-light:arrow-forward" class="text-2xl" />
      </button>

      <button
        @click="$emit('finish')"
        v-else
        class="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/20 active:scale-95 transition-all text-lg flex items-center gap-3"
      >
        <span>Finish Game</span>
        <Icon name="material-symbols-light:emoji-events" class="text-2xl" />
      </button>
    </div>

     <div v-else class="mt-8 text-center animate-pulse text-slate-500 font-bold">
        Waiting for host...
     </div>

  </div>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'

type Player = Database['public']['Tables']['players']['Row']

const props = defineProps<{
  players: Player[]
  isHost: boolean
  isLastQuestion: boolean
}>()

defineEmits<{
  (e: 'next' | 'finish'): void
}>()

const topPlayers = computed(() => {
  return [...props.players]
    .sort((a, b) => b.total_score - a.total_score)
    .slice(0, 5)
})
</script>
