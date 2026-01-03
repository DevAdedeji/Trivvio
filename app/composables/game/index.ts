import type { Database } from '~/types/supabase'

export type GameWithQuestions = Database['public']['Tables']['games']['Row'] & {
  questions: Database['public']['Tables']['questions']['Row'][]
}

export const useGame = (gameId: string) => {
  const client = useSupabaseClient<Database>()

  const loading = ref(false)
  const gameDetails = ref<GameWithQuestions | null>(null)

  const fetchGameWithQuestions = async () => {
    const { data, error } = await client
      .from('games')
      .select(
        `
        *,
        questions (*)
      `
      )
      .eq('id', gameId)
      .order('order_index', { foreignTable: 'questions' })
      .single()

    if (error) {
      console.error('Failed to fetch game:', error)
      return null
    }

    return data as GameWithQuestions
  }

  onMounted(async () => {
    if (gameId) {
      loading.value = true
      const game = await fetchGameWithQuestions()
      gameDetails.value = game
      loading.value = false
    }
  })

  return {
    loading,
    gameDetails,
  }
}
