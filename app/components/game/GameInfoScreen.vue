<template>
  <main class="flex-grow flex items-center justify-center p-3 sm:p-6 md:p-12 relative">
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none -z-10"
    />
    <div
      class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10"
    />
    <div
      class="glass-panel w-full max-w-xl rounded-2xl p-8 md:p-12 flex flex-col gap-6 shadow-2xl relative overflow-hidden"
    >
      <div
        class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-70"
      />
      <div class="flex flex-col space-y-8 w-full">
        <div class="space-y-2 flex flex-col items-center text-center">
          <div class="flex items-center gap-2 text-primary">
            <Icon name="material-symbols-light:check-circle" class="text-2xl" />
            <span class="text-sm font-bold uppercase tracking-wider">Success</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-black tracking-tight text-white">Game Ready!</h1>
          <p class="text-slate-400 text-lg">Your trivia room is live. Share the code to join.</p>
        </div>
        <div class="flex flex-col gap-4">
          <label class="text-xs font-bold uppercase tracking-widest text-slate-400 text-center"
            >Room Code</label
          >
          <div class="relative group">
            <div
              class="absolute -inset-1 bg-gradient-to-r from-primary to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"
            />
            <div
              class="relative bg-[#1b1f27] border border-slate-700 rounded-xl p-6 flex items-center justify-between shadow-lg"
            >
              <span
                class="font-mono text-3xl md:text-5xl md:text-6xl font-bold tracking-widest text-white select-all"
                >{{ game.code }}</span
              >
              <button
                class="size-12 rounded-lg bg-[#282e39] hover:text-white hover:bg-primary text-slate-300 flex items-center justify-center transition-all duration-200 active:scale-95"
                title="Copy Room Code"
                @click="copyCode"
              >
                <Icon name="material-symbols-light:content-copy" class="text-2xl" />
              </button>
            </div>
          </div>
        </div>
        <div class="flex flex-col gap-2">
          <label class="text-xs font-bold uppercase tracking-widest text-slate-400"
            >Direct Link</label
          >
          <div class="flex md:flex-row flex-col gap-2">
            <div class="relative flex-grow">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="material-symbols-light:link" class="text-lg text-slate-900" />
              </div>
              <input
                class="w-full pl-10 pr-4 py-3 bg-[#1b1f27] border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono truncate cursor-text"
                readonly
                type="text"
                :value="gameLink"
              />
            </div>
            <button
              class="px-4 py-2 bg-[#282e39] hover:bg-[#323a47] text-white rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              @click="copyLink"
            >
              <Icon name="material-symbols-light:content-copy" class="text-lg" />
              Copy Link
            </button>
          </div>
        </div>
        <div class="pt-4 flex flex-col gap-3">
          <button
            v-if="isHost"
            class="w-full bg-primary hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg shadow-primary/30 transform transition hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2"
            @click="startLobby"
            :disabled="loading"
          >
            <span v-if="loading">Starting Lobby...</span>
            <span v-else>Go to Lobby</span>
            <Icon v-if="!loading" name="material-symbols-light:arrow-forward" />
          </button>
          <p v-else class="text-center text-xs text-slate-500 mt-2">
            <span class="inline-block size-2 rounded-full bg-green-500 animate-pulse mr-1" />
            Waiting for host to start...
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'
import type { GameWithQuestions } from '~/composables/game'
import { useGameActions } from '~/composables/useGameActions'

import type { User } from '@supabase/supabase-js'

const props = defineProps<{
  game: GameWithQuestions,
  user: User | null
}>()

const { loading, startLobby: startLobbyAction } = useGameActions()

const isHost = computed(() => {
  return props.user && props.user.id === props.game.user_id
})

const startLobby = async () => {
  await startLobbyAction(props.game.id)
}

const gameLink = import.meta.env.VITE_PUBLIC_APP_URL + `/play/${props.game.id}`

const copyLink = () => {
  const { $toast } = useNuxtApp()
  navigator.clipboard.writeText(gameLink)
  $toast.success('Game link copied to clipboard!')
}

const copyCode = () => {
  const { $toast } = useNuxtApp()
  navigator.clipboard.writeText(props.game.code)
  $toast.success('Game code copied to clipboard!')
}

</script>
