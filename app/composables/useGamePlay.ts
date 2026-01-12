import type { Database } from '~/types/supabase'
import type { GameWithQuestions } from '~/composables/game'

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

    // 1. Call RPC to handle answer insertion and player stats update atomically
    // @ts-ignore
    const { data: result, error: rpcError } = await client.rpc('submit_answer', {
      p_game_id: gameId,
      p_player_id: playerId,
      p_question_id: currentQuestion.value.id,
      p_answer_text: answer,
      p_correct_answer: currentQuestion.value.correct_answer,
      p_is_correct: isCorrect,
      p_points: points
    })

    if (rpcError) {
      throw rpcError
    }

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
