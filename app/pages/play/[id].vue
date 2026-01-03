<template>
  <div
    class="font-display bg-background-dark min-h-screen flex flex-col animated-bg text-white overflow-x-hidden"
  >
    <div v-if="loading" />
    <div v-else-if="!loading && gameDetails">
      <GameInfoScreen :game="gameDetails" />
      <!-- <LobbyScreen :game="gameDetails" /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
// import LobbyScreen from '~/components/game/LobbyScreen.vue'
import { useGame } from '~/composables/game'
const route = useRoute()
const gameId = route.params.id as string
const { loading, gameDetails } = useGame(gameId)
</script>
