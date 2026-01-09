<template>
  <div
    class="font-display bg-background-dark min-h-screen flex flex-col animated-bg text-white overflow-x-hidden"
  >
    <div v-if="loading" />
    <div v-else-if="!loading && gameDetails">
      <div v-if="gameDetails.status === 'ready'">
        <GameInfoScreen :game="gameDetails" :user="authUser" />
      </div>
      <div v-else-if="gameDetails.status === 'lobby'">
        <div v-if="!currentPlayer && !isHost">
          <JoinGameScreen @join="handleGuestJoin" />
        </div>
        <div v-else>
          <LobbyScreen :game="gameDetails" :user="authUser" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import JoinGameScreen from '~/components/game/JoinGameScreen.vue'
import GameInfoScreen from '~/components/game/GameInfoScreen.vue'
import LobbyScreen from '~/components/game/LobbyScreen.vue'
import { useGame } from '~/composables/game'
import type { Database } from '~/types/supabase'

const route = useRoute()
const client = useSupabaseClient<Database>()
const gameId = route.params.id as string

// Fetch user immediately (using top-level await or onMounted preferrably, but top-level await is easiest for simple auth check)
// Using data: { user } destructuring
const { data: { user: authUser } } = await client.auth.getUser()

const { loading, gameDetails } = useGame(gameId)

const currentPlayer = ref<Database['public']['Tables']['players']['Row'] | null>(null)

const isHost = computed(() => {
  return authUser && gameDetails.value && authUser.id === gameDetails.value.user_id
})

// Check if player exists for current user/guest
const checkPlayerStatus = async () => {
  if (!gameDetails.value) return

  // 1. Check if Host
  if (authUser && authUser.id === gameDetails.value.user_id) {
    // Host Logic: Host is NOT a player. Do nothing here.
    // The template handles showing the lobby via `isHost` check.
    return
  }

  // 2. Check if Guest (LocalStorage)
  const guestId = localStorage.getItem('trivvio_player_id')
  if (guestId) {
    const { data } = await client
      .from('players')
      .select('*')
      .eq('game_id', gameId)
      .eq('player_id', guestId)
      .single()

    if (data) {
      currentPlayer.value = data
    }
  }
}

const handleGuestJoin = async (nickname: string) => {
  let guestId = localStorage.getItem('trivvio_player_id')
  if (!guestId) {
    guestId = crypto.randomUUID()
    localStorage.setItem('trivvio_player_id', guestId)
  }

  const { data, error } = await client
    .from('players')
    .insert({
      game_id: gameId,
      display_name: nickname,
      is_host: false,
      player_id: guestId,
    })
    .select()
    .single()

  if (data) {
    currentPlayer.value = data
  }
  if (error) {
    console.error('Failed to join game:', error)
    // Handle error (e.g. duplicate name constraint? though we use UUIDs)
  }
}

let gameChannel: ReturnType<typeof client.channel> | null = null

onMounted(async () => {
  // Subscribe to game status changes
  gameChannel = client
    .channel(`game_status:${gameId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'games',
        filter: `id=eq.${gameId}`,
      },
      (payload) => {
        if (gameDetails.value) {
          gameDetails.value.status = payload.new.status
        }
      }
    )
    .subscribe()
})

onUnmounted(() => {
  if (gameChannel) client.removeChannel(gameChannel)
})

watch(gameDetails, async (newGame) => {
  if (newGame) {
    await checkPlayerStatus()
  }
})


</script>
