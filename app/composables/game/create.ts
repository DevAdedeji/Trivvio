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
export const useCreateGame = () => {
  const currentStep = ref(1)
  return {
    amount_of_questions,
    selectedAmountOfQuestions,
    currentStep,
  }
}
