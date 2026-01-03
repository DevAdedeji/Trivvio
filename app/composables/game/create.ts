import type { Question } from '~/types/question'
import type { Database } from '~/types/supabase'
import { generateGameCode } from '~/utils'

type QuestionInsert = Database['public']['Tables']['questions']['Insert']

const amount_of_questions = [
  {
    id: 1,
    icon: 'material-symbols-light:bolt',
    count: 3,
    text: 'Quick Fire',
  },
  {
    id: 2,
    icon: 'material-symbols-light:timer',
    count: 5,
    text: 'Standard',
  },
  {
    id: 3,
    icon: 'material-symbols-light:directions-run',
    count: 7,
    text: 'Marathon',
  },
  {
    id: 4,
    icon: 'material-symbols-light:emoji-events',
    count: 10,
    text: 'Epic',
  },
]

const createEmptyQuestion = (): Question => ({
  id: crypto.randomUUID(),
  question_text: '',
  option_a: '',
  option_b: '',
  option_c: '',
  option_d: '',
  correct_answer: null,
  time_limit: 10,
})

export const useCreateGame = () => {
  const TOTAL_STEPS = 3

  const client = useSupabaseClient<Database>()

  const selectedAmountOfQuestions = useState<number | null>('selectedAmountOfQuestions', () => null)

  const questions = useState<Question[]>('createGameQuestions', () => [createEmptyQuestion()])

  const selectedQuestion = useState<Question | null>(
    'selectedQuestion',
    () => questions.value[0] ?? null
  )

  const currentStep = useState<number>('createGameStep', () => 1)
  const gameId = useState<string | null>('createGameId', () => null)
  const gameTitle = useState<string>('createGameTitle', () => '')
  const isSaving = useState<boolean>('createGameSaving', () => false)

  const maxQuestionsReached = computed(
    () =>
      selectedAmountOfQuestions.value !== null &&
      questions.value.length >= selectedAmountOfQuestions.value
  )

  const isQuestionComplete = (question: Question): boolean => {
    return !!(
      question.question_text.trim() &&
      question.option_a.trim() &&
      question.option_b.trim() &&
      question.option_c.trim() &&
      question.option_d.trim() &&
      question.correct_answer
    )
  }

  const allQuestionsComplete = computed(() => {
    return (
      questions.value.every(isQuestionComplete) &&
      questions.value.length === selectedAmountOfQuestions.value
    )
  })

  const progressPercentage = computed(() => {
    return Math.round((currentStep.value / TOTAL_STEPS) * 100)
  })

  const canProceedToNextStep = computed(() => {
    if (currentStep.value === 1)
      return !!selectedAmountOfQuestions.value && gameTitle.value.length > 0
    if (currentStep.value === 2)
      return (
        questions.value.length === selectedAmountOfQuestions.value && allQuestionsComplete.value
      )
    return true
  })

  const nextStep = () => {
    if (currentStep.value >= 3) return
    if (canProceedToNextStep.value) {
      if (currentStep.value === 2) {
        createGameWithQuestions()
        return
      }
      if (currentStep.value === 3) {
        publishGame()
        return
      }
      currentStep.value++
    }
  }
  const prevStep = () => {
    if (currentStep.value === 1) return
    currentStep.value--
  }

  const addEmptyQuestion = () => {
    if (maxQuestionsReached.value) return
    questions.value.push(createEmptyQuestion())
    selectedQuestion.value = questions.value.at(-1)!
  }

  const deleteQuestion = (questionId: Question['id']) => {
    if (questions.value.length === 1) return

    const index = questions.value.findIndex((q) => q.id === questionId)
    if (index === -1) return

    questions.value.splice(index, 1)

    if (selectedQuestion.value?.id === questionId) {
      selectedQuestion.value = questions.value[Math.max(0, index - 1)] ?? null
    }
  }

  const createGameWithQuestions = async () => {
    if (!selectedAmountOfQuestions.value) return

    const {
      data: { user: authUser },
    } = await client.auth.getUser()

    if (!authUser?.id) return

    isSaving.value = true

    try {
      const gameCode = generateGameCode()
      const { data: game, error: gameError } = await client
        .from('games')
        .insert({
          question_count: selectedAmountOfQuestions.value,
          status: 'draft',
          user_id: authUser.id,
          title: gameTitle.value,
          code: gameCode,
        })
        .select()
        .single()

      if (gameError) throw gameError

      const questionPayload: QuestionInsert[] = questions.value.map((q, index) => ({
        game_id: game.id,
        question_text: q.question_text,
        option_a: q.option_a,
        option_b: q.option_b,
        option_c: q.option_c,
        option_d: q.option_d,
        correct_answer: q.correct_answer ?? '',
        time_limit: q.time_limit,
        order_index: index + 1,
      }))

      const { error: questionError } = await client.from('questions').insert(questionPayload)

      if (questionError) throw questionError

      gameId.value = game.id
      currentStep.value = 3
      return game
    } catch (error) {
      console.error('Failed to create game:', error)
    } finally {
      isSaving.value = false
    }
  }

  const publishGame = async () => {
    if (!gameId.value) return
    try {
      const { error: gameError } = await client
        .from('games')
        .update({ status: 'ready' })
        .eq('id', gameId.value)
      if (gameError) throw gameError
      return navigateTo(`/play/${gameId.value}`)
    } catch (error) {
      console.error('Failed to create game:', error)
    }
  }

  const resetCreateGame = () => {
    selectedAmountOfQuestions.value = null
    questions.value = [createEmptyQuestion()]
    selectedQuestion.value = questions.value[0]!
    currentStep.value = 1
    gameId.value = null
    isSaving.value = false
  }

  return {
    amount_of_questions,
    selectedAmountOfQuestions,
    gameTitle,
    currentStep,
    nextStep,
    prevStep,
    questions,
    selectedQuestion,
    addEmptyQuestion,
    deleteQuestion,
    createGameWithQuestions,
    resetCreateGame,
    isQuestionComplete,
    allQuestionsComplete,
    progressPercentage,
    gameId,
    isSaving,
    publishGame,
  }
}
