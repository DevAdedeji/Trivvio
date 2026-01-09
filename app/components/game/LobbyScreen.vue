<template>
  <main class="flex-grow flex flex-col p-4 md:p-8 gap-6 max-w-7xl mx-auto w-full relative z-10">
    <!-- Header Section -->
    <div class="flex gap-6">
      <div class="w-[65%] flex flex-col gap-6">
        <!-- Game Code Card -->
        <div class="md:col-span-2 relative group">
          <div
            class="relative bg-[#1b1f27] border border-slate-700/50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl"
          >
            <div class="text-center md:text-left">
              <h2 class="text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
                Join at trivia.game
              </h2>
              <div class="font-mono text-6xl md:text-7xl font-black tracking-wider text-white">
                {{ game.code }}
              </div>
            </div>
            <div class="flex gap-3">
              <button
                class="flex items-center gap-2 px-4 py-2.5 bg-[#282e39] hover:bg-blue-600 hover:text-white text-slate-300 rounded-xl font-medium transition-all duration-200 active:scale-95"
                @click="copyLink"
              >
                <Icon name="material-symbols-light:content-copy" class="text-xl" />
                <span>Copy Link</span>
              </button>
              <button
                class="flex items-center gap-2 px-4 py-2.5 bg-[#282e39] hover:bg-blue-600 hover:text-white text-slate-300 rounded-xl font-medium transition-all duration-200 active:scale-95"
              >
                <Icon name="material-symbols-light:share" class="text-xl" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
        <!-- Status Bar -->
        <div
          class="bg-[#1b1f27]/80 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3">
            <div class="relative flex items-center justify-center size-10">
              <div v-if="!isHost" class="absolute inset-0 bg-blue-500/20 rounded-full animate-ping" />
              <div
                class="relative bg-[#282e39] rounded-full size-10 flex items-center justify-center text-blue-400"
              >
                <Icon name="material-symbols-light:sync" class="text-xl animate-spin" />
              </div>
            </div>
            <div>
              <h3 v-if="isHost" class="text-white font-bold text-lg">Waiting for players to join...</h3>
              <h3 v-else class="text-white font-bold text-lg">Waiting for host to start...</h3>
              <p class="text-slate-400 text-sm">Keep this screen open.</p>
            </div>
          </div>
          <div v-if="isHost" class="flex items-center gap-3">
            <button
              @click="startGame"
              :disabled="loading || players.length === 0"
              class="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>Start Game</span>
              <Icon name="material-symbols-light:play-arrow" class="text-xl" />
            </button>
          </div>
          <div
            v-else
            class="bg-[#151921] px-4 py-3 rounded-lg border border-slate-800 flex flex-col items-center gap-2"
          >
            <span class="text-xs font-bold uppercase tracking-widest text-slate-500">Your Status</span>
            <div class="flex items-center gap-2">
              <span class="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span class="text-white font-bold text-sm">Ready to play</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Game Settings Card -->
      <div class="w-[35%] bg-[#151921] border border-slate-800 rounded-2xl p-6 flex flex-col gap-4">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2 text-blue-400">
            <Icon name="material-symbols-light:info" class="text-xl" />
            <h3 class="font-bold text-sm uppercase tracking-wider">Game Settings</h3>
          </div>
          <button class="text-slate-500 hover:text-white transition-colors">
            <Icon name="material-symbols-light:settings" class="text-xl" />
          </button>
        </div>

        <div class="bg-[#1b1f27] rounded-xl p-3 flex items-center gap-4">
          <div
            class="size-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center"
          >
            <Icon name="material-symbols-light:quiz" class="text-2xl" />
          </div>
          <div>
            <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Questions
            </div>
            <div class="text-white font-bold">{{ game.question_count }} Qs</div>
          </div>
        </div>

        <!-- <div class="bg-[#1b1f27] rounded-xl p-3 flex items-center gap-4">
          <div
            class="size-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center"
          >
            <Icon name="material-symbols-light:timer" class="text-2xl" />
          </div>
          <div>
            <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Time Limit
            </div>
            <div class="text-white font-bold">20s / Q</div>
          </div>
        </div> -->

        <div class="bg-[#1b1f27] rounded-xl p-3 flex items-center gap-4">
          <div
            class="size-10 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center"
          >
            <Icon name="material-symbols-light:category" class="text-2xl" />
          </div>
          <div>
            <div class="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Topic</div>
            <div class="text-white font-bold truncate">{{ game.title }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lobby Section -->
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h2 class="text-xl font-bold text-white">Lobby</h2>
          <span class="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
            {{ players?.length || 0 }} Players
          </span>
        </div>

      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <!-- Player Card -->
        <TransitionGroup name="list">
          <div
            v-for="(player, index) in filteredPlayers"
            :key="player.id"
            class="group relative bg-[#1b1f27] hover:bg-[#232933] border border-slate-700/50 hover:border-blue-500/50 rounded-2xl p-4 flex flex-col items-center gap-3 transition-all duration-300"
          >
            <div class="relative">
              <div
                class="size-16 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-slate-400 text-2xl font-bold overflow-hidden border-2 border-[#1b1f27] shadow-lg group-hover:scale-105 transition-transform duration-300"
              >
                <img
                  v-if="player.avatar_url"
                  :src="player.avatar_url"
                  :alt="player.display_name"
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ player.display_name.charAt(0).toUpperCase() }}</span>
              </div>
              <div
                v-if="player.is_host"
                class="absolute -bottom-1 -right-1 size-6 bg-[#1b1f27] rounded-full flex items-center justify-center"
              >
                <div
                  class="size-4 bg-yellow-500 text-black text-[10px] rounded-full flex items-center justify-center"
                >
                  <Icon name="material-symbols-light:star" class="text-xs" />
                </div>
              </div>
            </div>
            <div class="text-center w-full">
              <h3 class="text-white font-bold text-sm truncate w-full">
                {{ player.display_name }}
              </h3>
              <p class="text-[10px] font-medium text-slate-500 uppercase tracking-wide mt-1">
                <span v-if="player.is_host" class="text-yellow-500">Host</span>
                <span v-else>#{{ index + 1 }} Joined</span>
              </p>
            </div>
          </div>
        </TransitionGroup>

        <!-- Empty State slots for visual fullness if few players -->
        <div
          v-if="players.length < 6"
          v-for="i in 6 - players.length"
          :key="`empty-${i}`"
          class="bg-[#1b1f27]/30 border border-slate-800/50 border-dashed rounded-2xl p-4 flex flex-col items-center gap-3 opacity-50"
        >
          <div class="size-16 rounded-full bg-slate-800/50" />
          <div class="w-20 h-4 bg-slate-800/50 rounded" />
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { Database } from '~/types/supabase'
import type { GameWithQuestions } from '~/composables/game'

import type { User } from '@supabase/supabase-js'

const props = defineProps<{
  game: GameWithQuestions
  user: User | null
}>()

const client = useSupabaseClient<Database>()
const searchQuery = ref('')
const players = ref<Database['public']['Tables']['players']['Row'][]>([])

// Fetch initial players
const fetchPlayers = async () => {
  const { data, error } = await client
    .from('players')
    .select('*')
    .eq('game_id', props.game.id)
    .order('joined_at', { ascending: true })

  if (data) {
    players.value = data
  }
}

// Realtime subscription
const subscribeToPlayers = () => {
  const channel = client
    .channel(`game_lobby:${props.game.id}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'players',
        filter: `game_id=eq.${props.game.id}`,
      },
      (payload) => {
        if (payload.eventType === 'INSERT') {
          players.value.push(payload.new as Database['public']['Tables']['players']['Row'])
        } else if (payload.eventType === 'DELETE') {
          players.value = players.value.filter((p) => p.id !== payload.old.id)
        } else if (payload.eventType === 'UPDATE') {
          const index = players.value.findIndex((p) => p.id === payload.new.id)
          if (index !== -1) {
            players.value[index] = payload.new as Database['public']['Tables']['players']['Row']
          }
        }
      }
    )
    .subscribe()

  return channel
}

let realtimeChannel: ReturnType<typeof client.channel> | null = null

onMounted(async () => {
  await fetchPlayers()
  realtimeChannel = subscribeToPlayers()
})

onUnmounted(() => {
  if (realtimeChannel) {
    client.removeChannel(realtimeChannel)
  }
})

const filteredPlayers = computed(() => {
  if (!searchQuery.value) return players.value
  return players.value.filter((p) =>
    p.display_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const loading = ref(false)

const isHost = computed(() => {
  return props.user && props.user.id === props.game.user_id
})

const startGame = async () => {
  if (!isHost.value) return
  loading.value = true

  const { error } = await client
    .from('games')
    .update({ status: 'active' })
    .eq('id', props.game.id)

  if (error) {
    console.error('Failed to start game:', error)
  }
  loading.value = false
}

const copyLink = () => {
  const link = `${window.location.origin}/play/${props.game.id}`
  navigator.clipboard.writeText(link)
  // Could add toast notification here
}
</script>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
