<template>
  <main class="min-h-screen flex items-center justify-center p-6 md:p-12 relative bg-[#0f1218] overflow-hidden font-display">
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none"
    />
    <div
      class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"
    />

    <div
      class="w-full max-w-md bg-[#1b1f27]/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-8 md:p-10 shadow-2xl relative z-10"
    >
        <div class="text-center flex flex-col items-center justify-center gap-4 mb-10">
          <div
            class="size-14 flex items-center justify-center bg-gradient-to-br from-primary to-blue-400 rounded-2xl shadow-lg shadow-primary/25"
            >
            <Icon name="material-symbols-light:bolt" class="text-white size-10" />
            </div>
          <h1 class="text-3xl font-black text-white mb-2 tracking-tight">Ready to Play?</h1>
          <p class="text-slate-400">Enter your game PIN to join the live session.</p>
        </div>

        <form @submit.prevent="handleJoin" class="flex flex-col gap-6">
            <!-- Game PIN Input -->
             <div class="space-y-2">
                <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Game PIN</label>
                <div class="relative">
                    <input
                        v-model="gamePin"
                        type="text"
                        inputmode="numeric"
                        placeholder="000000"
                        maxlength="6"
                        class="w-full bg-[#0f1218] border border-slate-700 rounded-xl py-4 px-4 text-center text-3xl font-black text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all tracking-[0.5em]"
                        required
                    >
                </div>
            </div>

            <!-- Username Input -->
            <div class="space-y-2">
                 <label class="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Username</label>
                 <div class="relative">
                    <input
                        v-model="username"
                        type="text"
                        placeholder="Enter your username"
                        class="w-full bg-[#0f1218] border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all font-bold"
                        required
                    >
                     <Icon
                        name="material-symbols-light:person"
                        class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl"
                    />
                 </div>
            </div>

            <button
                type="submit"
                :disabled="isLoading || !isValid"
                class="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg shadow-blue-500/30 transform transition hover:-translate-y-1 active:translate-y-0 flex items-center justify-center gap-2 mt-4"
            >
                <span v-if="isLoading">Joining...</span>
                <span v-else>Join Game</span>
                <Icon v-if="!isLoading" name="material-symbols-light:rocket-launch" />
            </button>
        </form>

        <div class="mt-8 text-center">
             <NuxtLink to="/" class="text-slate-500 hover:text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                 <Icon name="material-symbols-light:arrow-back" />
                 Back to Home
             </NuxtLink>
        </div>

    </div>
  </main>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'
import { usePlayer } from '~/composables/usePlayer'

const client = useSupabaseClient<Database>()
const { joinAsGuest } = usePlayer()
const { $toast } = useNuxtApp()

const gamePin = ref('')
const username = ref('')
const isLoading = ref(false)

const isValid = computed(() => {
    return gamePin.value.length >= 6 && username.value.trim().length > 0
})

const handleJoin = async () => {
    if (!isValid.value) return
    isLoading.value = true

    try {
        // 1. Find Game by PIN
        // NOTE: 'code' column in games table
        const { data: game, error: searchError } = await client
            .from('games')
            .select('id, status')
            .eq('code', gamePin.value)
            .single()

        if (searchError || !game) {
            $toast.error('Invalid Game PIN. Please check and try again.')
            isLoading.value = false
            return
        }

        if (game.status === 'finished') {
             $toast.error('This game has already finished.')
             isLoading.value = false
             return
        }

        // 2. Join as Guest
        const { error: joinError } = await joinAsGuest(game.id, username.value)

        if (joinError) {
             isLoading.value = false
             return
        }

        // 3. Redirect
        // Wait a tick for toast? No need.
        await navigateTo(`/play/${game.id}`)

    } catch (e) {
        console.error(e)
        $toast.error('An unexpected error occurred.')
        isLoading.value = false
    }
}
</script>
