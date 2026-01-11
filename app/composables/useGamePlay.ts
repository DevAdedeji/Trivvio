import type { Database } from '~/types/supabase'
import type { GameWithQuestions } from '~/composables/game'
import type { User } from '@supabase/supabase-js'

export const useGamePlay = (gameId: string) => {
  const client = useSupabaseClient<Database>()

  // Game State
  const game = ref<GameWithQuestions | null>(null)

  // Computed
  const currentQuestionIndex = computed(() => game.value?.current_question_index ?? 0)
  const currentPhase = computed(() => game.value?.phase ?? 'lobby')
  const currentQuestion = computed(() => game.value?.questions[currentQuestionIndex.value] ?? null)
  const isLeaderboard = computed(() => currentPhase.value === 'leaderboard')
  const isQuestion = computed(() => currentPhase.value === 'question')
  const isFinished = computed(() => game.value?.status === 'finished')

  // Timer
  const timeRemaining = ref(0)
  let timerInterval: NodeJS.Timeout | null = null

  // Realtime Answer Stats
  const answerCounts = ref<Record<string, number>>({})
  const totalAnswers = computed(() => Object.values(answerCounts.value).reduce((a, b) => a + b, 0))
  let answersChannel: ReturnType<typeof client.channel> | null = null

  // Actions
  const syncGameState = (newGameState: GameWithQuestions) => {
    // Detect Question Change to reset stats
    if (newGameState.questions[newGameState.current_question_index]?.id !== currentQuestion.value?.id) {
       answerCounts.value = {}
    }
    game.value = newGameState

    // Sync Timer
    if (newGameState.round_ends_at) {
      const endsAt = new Date(newGameState.round_ends_at).getTime()
      const now = Date.now()
      const diff = Math.max(0, Math.floor((endsAt - now) / 1000))
      timeRemaining.value = diff

      startTimer()
    }
  }

  const subscribeToAnswers = () => {
    if (answersChannel) return

    answersChannel = client
      .channel(`game_answers:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'answers',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          const newAnswer = payload.new as Database['public']['Tables']['answers']['Row']
          // Only count for current question
          if (currentQuestion.value && newAnswer.question_id === currentQuestion.value.id) {
             const ans = newAnswer.player_answer
             answerCounts.value[ans] = (answerCounts.value[ans] || 0) + 1
          }
        }
      )
      .subscribe()
  }

  const cleanup = () => {
      if (timerInterval) clearInterval(timerInterval)
      if (answersChannel) client.removeChannel(answersChannel)
  }

  const startTimer = () => {
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value--
      } else {
        if (timerInterval) clearInterval(timerInterval)
      }
    }, 1000)
  }

  const submitAnswer = async (playerId: string, answer: string) => {
    if (!currentQuestion.value) return

    // Calculate points (Speed bonus)
    // Base 100 + (Time Remaining * 10)
    const isCorrect = answer === currentQuestion.value.correct_answer
    const points = isCorrect ? 100 + (timeRemaining.value * 10) : 0

    const { error } = await client.from('answers').insert({
      game_id: gameId,
      player_id: playerId, // This needs the UUID from the players table, NOT the auth user ID or localStorage ID directly.
      // ACTUALLY: The `answers` table `player_id` FK references `players.id` (UUID).
      // We need to pass the row ID of the player.
      question_id: currentQuestion.value.id,
      player_answer: answer,
      correct_answer: currentQuestion.value.correct_answer,
      is_correct: isCorrect,
      points_earned: points,
      game_session_id: '00000000-0000-0000-0000-000000000000' // FIXME: We don't have sessions yet, might need to ignore or fix schema.
      // Migration note: `game_session_id` seems required in schema but we aren't using session logic yet.
      // Let's check schema. `game_session_id` IS required. We might need to fetch the session or make it nullable.
      // For now, let's assume `game_session_id` is NOT used in this simple flow or we need to create one.
      // Let's create a session on join? Or make it nullable.
      // DECISION: I will make `game_session_id` nullable in a migration fix or just pass a dummy UUID if DB allows.
      // Checking schema previously: `game_session_id` is NOT NULL? Yes.
      // I will add a migration to make `game_session_id` nullable as simpler approach.
    })

    if (error) throw error
    return points
  }

  const nextQuestion = async () => {
    if (!game.value) return
    const nextIndex = currentQuestionIndex.value + 1

    // Set 10s timer for question + 5s buffer/transition? Or just 20s.
    // Question has `time_limit`. Use that.
    const timeLimit = game.value.questions[nextIndex]?.time_limit || 20
    const roundEndsAt = new Date(Date.now() + timeLimit * 1000).toISOString()

    await client.from('games').update({
      current_question_index: nextIndex,
      phase: 'question',
      round_ends_at: roundEndsAt
    }).eq('id', gameId)
  }

  const endQuestionRound = async () => {
     await client.from('games').update({
      phase: 'leaderboard',
      round_ends_at: null
    }).eq('id', gameId)
  }

  const finishGame = async () => {
      await client.from('games').update({
      status: 'finished'
    }).eq('id', gameId)
  }

  return {
    game,
    currentQuestion,
    currentPhase,
    timeRemaining,
    isLeaderboard,
    isQuestion,
    isFinished,
    syncGameState,
    submitAnswer,
    nextQuestion,
    endQuestionRound,
    finishGame,
    answerCounts,
    totalAnswers,
    subscribeToAnswers,
    cleanup
  }
}
