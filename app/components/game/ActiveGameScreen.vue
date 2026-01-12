<template>
  <main class="flex-grow flex flex-col h-screen w-full relative overflow-hidden bg-[#0f1218]">
     <!-- Background Effects -->
    <div
      class="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none"
    />
    <div
      class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"
    />

    <!-- QUESTION PHASE -->
    <QuestionView
      v-if="isQuestion && currentQuestion"
      :question="currentQuestion"
      :is-host="isHost"
      :time-remaining="timeRemaining"
      :answer-counts="answerCounts"
      :total-answers="totalAnswers"
      :total-players="players.length"
      :question-index="game.current_question_index"
      :total-questions="game.questions?.length || 0"
      @answer="handleAnswer"
    />

    <!-- LEADERBOARD PHASE -->
    <LeaderboardView
      v-else-if="isLeaderboard"
      :players="players"
      :is-host="isHost"
      :is-last-question="isLastQuestion"
      @next="nextQuestion"
      @finish="finishGame"
    />

    <!-- Loading / Waiting State -->
    <div v-else class="flex flex-col items-center justify-center h-full text-slate-400">
      <Icon name="material-symbols-light:sync" class="text-4xl animate-spin mb-4" />
      <p>Syncing game state...</p>
    </div>
  </main>
</template>

<script setup lang="ts">
import type { GameWithQuestions } from '~/composables/game'
import type { User } from '@supabase/supabase-js'

import QuestionView from './QuestionView.vue'
import LeaderboardView from './LeaderboardView.vue'

import { useGamePlay } from '~/composables/useGamePlay'
import { useLobby } from '~/composables/useLobby' // We reuse useLobby to get players for leaderboard!

const props = defineProps<{
  game: GameWithQuestions
  user: User | null
}>()

const isHost = computed(() => {
  return props.user?.id === props.game.user_id
})

// Game Play Logic
const {
  syncGameState,
  currentQuestion,
  isQuestion,
  isLeaderboard,
  timeRemaining,
  submitAnswer,
  nextQuestion,
  endQuestionRound,
  finishGame,
  answerCounts,
  totalAnswers,
  subscribeToAnswers,
  cleanup
} = useGamePlay(props.game.id)

// Players Logic (Reuse useLobby for realtime player list/scores)
const { players, fetchPlayers, subscribeToPlayers } = useLobby(props.game.id)

// Init
onMounted(async () => {
    syncGameState(props.game)
    await fetchPlayers()
    subscribeToPlayers()
    subscribeToAnswers()
})

onUnmounted(() => {
    cleanup()
})

// Watch for game state updates passed from parent (play/[id].vue)
watch(() => props.game, (newVal) => {
    syncGameState(newVal)
}, { deep: true })

// Watch for Timer End (Host Only)
watch(timeRemaining, async (val) => {
    if (val === 0 && isHost.value && isQuestion.value) {
        // Timer finished, host triggers move to Leaderboard
        await endQuestionRound()
    }
})

// Watch game phase to re-fetch players for leaderboard (Sync fix)
watch(() => props.game.phase, async (newPhase) => {
    if (newPhase === 'leaderboard' || newPhase === 'finished') {
        await fetchPlayers()
    }
})

const isLastQuestion = computed(() => {
    if (!props.game.questions) return false
    return props.game.current_question_index >= props.game.questions.length - 1
})

const handleAnswer = async (optionKey: string) => {
    const { $toast } = useNuxtApp()
    try {
        const playerId = getPlayerId()
        console.log('[ActiveGameScreen] handleAnswer', { optionKey, playerId, playersCount: players.value.length })

        if (!playerId) {
             const guestId = localStorage.getItem('trivvio_player_id')
             console.error('[ActiveGameScreen] No player ID found. LocalStorage:', guestId, 'Players:', players.value)
             $toast.error(`Could not identify player. (GuestID: ${guestId?.slice(0,4)}...)`)
             return
        }

        if (!props.game.questions) return

        const question = props.game.questions[props.game.current_question_index]
        if (!question) return

        // Map option_a -> A, option_b -> B, etc.
        const optionMap: Record<string, string> = {
            'option_a': 'A',
            'option_b': 'B',
            'option_c': 'C',
            'option_d': 'D'
        }
        const answerValue = optionMap[optionKey] || optionKey

        console.log('[ActiveGameScreen] Submitting answer:', { optionKey, answerValue, correctAnswer: question.correct_answer })

        const resultPoints = await submitAnswer(playerId, answerValue)
        console.log('[ActiveGameScreen] Submit result:', resultPoints)

        if (resultPoints !== null) { // resultPoints can be 0 if wrong, so check for null/undefined if error
             if (resultPoints && resultPoints > 0) {
                 $toast.success(`Correct! +${resultPoints} pts`)
             } else {
                 $toast.error('Wrong answer!')
             }
        }

    } catch (e) {
        console.error('[ActiveGameScreen] Error submitting answer:', e)
        $toast.error('Failed to submit answer')
    }
}

// Helper to get current player ID (for Guest) from local storage or for Host (though host doesn't play)
const getPlayerId = () => {
    // If guest
    const guestId = localStorage.getItem('trivvio_player_id')
    // We need the database ROW ID for the player, not just the UUID.
    // Sync problem: `usePlayer` fetches `currentPlayer` which has the ID.
    // Let's import `usePlayer` just to get the current player DB Object.
    // BETTER: The `players` list from `useLobby` has all players. Find self.

    if (guestId) {
        const p = players.value.find(p => p.player_id === guestId)
        return p?.id
    }
    return null
}

</script>
