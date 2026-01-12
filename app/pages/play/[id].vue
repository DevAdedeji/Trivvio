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
      <div v-else-if="gameDetails.status === 'active'">
         <ActiveGameScreen :game="gameDetails" :user="authUser" />
      </div>
      <div v-else-if="gameDetails.status === 'finished'">
         <FinalLeaderboard :players="players" :game-id="gameDetails.id" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted, onUnmounted } from 'vue'
import JoinGameScreen from '~/components/game/JoinGameScreen.vue'
import GameInfoScreen from '~/components/game/GameInfoScreen.vue'
import LobbyScreen from '~/components/game/LobbyScreen.vue'
import ActiveGameScreen from '~/components/game/ActiveGameScreen.vue'
import FinalLeaderboard from '~/components/game/FinalLeaderboard.vue'
import { useGame } from '~/composables/game'
import { usePlayer } from '~/composables/usePlayer'
import { useLobby } from '~/composables/useLobby'
import type { Database } from '~/types/supabase'

const route = useRoute()
const client = useSupabaseClient<Database>()
const gameId = route.params.id as string


const { data: { user: authUser } } = await client.auth.getUser()

const { loading, gameDetails } = useGame(gameId)
const { players, fetchPlayers, subscribeToPlayers } = useLobby(gameId)

const { currentPlayer, checkPlayerStatus, joinAsGuest } = usePlayer()

const isHost = computed(() => {
  return authUser && gameDetails.value && authUser.id === gameDetails.value.user_id
})

// Check if player exists for current user/guest
const checkStatus = async () => {
  if (!gameDetails.value) return
  await checkPlayerStatus(gameId, authUser, gameDetails.value.user_id)
  if (gameDetails.value.status === 'finished') {
    await fetchPlayers()
  }
}

const handleGuestJoin = async (nickname: string) => {
    await joinAsGuest(gameId, nickname)
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
          Object.assign(gameDetails.value, payload.new)
        }
      }
    )
    .subscribe()

    // Also subscribe to players to ensure we have list for leaderboard
    await fetchPlayers()
    subscribeToPlayers()
})

onUnmounted(() => {
  if (gameChannel) client.removeChannel(gameChannel)
})

watch(gameDetails, async (newGame) => {
  if (newGame) {
    await checkStatus()
  }
})


</script>
