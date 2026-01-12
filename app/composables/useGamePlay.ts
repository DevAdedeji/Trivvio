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

    // 1. Insert Answer
    const { error: answerError } = await client.from('answers').insert({
      game_id: gameId,
      player_id: playerId,
      question_id: currentQuestion.value.id,
      player_answer: answer,
      correct_answer: currentQuestion.value.correct_answer,
      is_correct: isCorrect,
      points_earned: points,
    })

    if (answerError) {
      console.error('[useGamePlay] Answer Insert Error', answerError)
      throw answerError
    }

    // 2. Fetch Current Stats
    const { data: player, error: fetchError } = await client
      .from('players')
      .select('total_score, current_streak, best_streak, correct_answers, wrong_answers')
      .eq('id', playerId)
      .single()

    if (fetchError || !player) {
      // Non-blocking error, but good to know
      console.error('[useGamePlay] Player Fetch Error', fetchError)
      return points
    }

    // 3. Calculate New Stats
    const newScore = (player.total_score || 0) + points
    const newCorrect = (player.correct_answers || 0) + (isCorrect ? 1 : 0)
    const newWrong = (player.wrong_answers || 0) + (isCorrect ? 0 : 1)

    let newStreak = isCorrect ? (player.current_streak || 0) + 1 : 0
    let bestStreak = player.best_streak || 0
    if (newStreak > bestStreak) {
        bestStreak = newStreak
    }

    // 4. Update Player
    const { error: updateError } = await client
      .from('players')
      .update({
        total_score: newScore,
        current_streak: newStreak,
        best_streak: bestStreak,
        correct_answers: newCorrect,
        wrong_answers: newWrong,
        last_active_at: new Date().toISOString()
      })
      .eq('id', playerId)

    if (updateError) {
       console.error('[useGamePlay] Player Update Error', updateError)
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
