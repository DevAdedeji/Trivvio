import type { Database } from '~/types/supabase'
import { useCreateGame } from '~/composables/game/create'

export type GameWithQuestions = Database['public']['Tables']['games']['Row'] & {
  questions: Database['public']['Tables']['questions']['Row'][]
}

export const usePreviewGame = () => {
  const client = useSupabaseClient<Database>()
  const { gameId } = useCreateGame()

  const loading = ref(false)
  const gamePreview = ref<GameWithQuestions | null>(null)

  const fetchGameWithQuestions = async (gameId: string) => {
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
    if (gameId.value) {
      loading.value = true
      const game = await fetchGameWithQuestions(gameId.value)
      gamePreview.value = game
      loading.value = false
    }
  })

  return {
    loading,
    gamePreview,
  }
}
