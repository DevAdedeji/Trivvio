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
const selectedAmountOfQuestions = ref<number | null>(null)
interface Question {
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string | null
  time_limit: number
  id: number
}
const questions = ref<Question[]>([
  {
    id: 1,
    question: 'What is the capital of France?',
    option_a: 'Paris',
    option_b: 'Abuja',
    option_c: 'Berlin',
    option_d: 'London',
    correct_answer: 'A',
    time_limit: 10,
  },
])
const selectedQuestion = ref<Question>({
  id: 1,
  question: 'What is the capital of France?',
  option_a: 'Paris',
  option_b: 'Abuja',
  option_c: 'Berlin',
  option_d: 'London',
  correct_answer: 'A',
  time_limit: 10,
})
export const useCreateGame = () => {
  const currentStep = ref(1)
  const nextStep = () => {
    if (currentStep.value >= 3) return
    currentStep.value++
  }
  const prevStep = () => {
    if (currentStep.value === 1) return
    currentStep.value--
  }
  const addEmptyQuestion = () => {
    if (
      selectedAmountOfQuestions.value &&
      questions.value.length >= selectedAmountOfQuestions.value
    )
      return
    questions.value.push({
      id: 3,
      question: '',
      option_a: '',
      option_b: '',
      option_c: '',
      option_d: '',
      correct_answer: null,
      time_limit: 10,
    })
  }

  const deleteQuestion = (questionId: number) => {
    // Prevent deleting if it's the only question
    if (questions.value.length === 1) return

    const index = questions.value.findIndex((q) => q.id === questionId)
    if (index === -1) return

    questions.value.splice(index, 1)
  }

  return {
    amount_of_questions,
    selectedAmountOfQuestions,
    currentStep,
    nextStep,
    prevStep,
    questions,
    selectedQuestion,
    addEmptyQuestion,
    deleteQuestion,
  }
}
