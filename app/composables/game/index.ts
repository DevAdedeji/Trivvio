import type { Database } from '~/types/supabase'

type GameWithQuestions = Database['public']['Tables']['games']['Row'] & {
  questions: Database['public']['Tables']['questions']['Row'][]
}

export const useGame = () => {
  const client = useSupabaseClient<Database>()

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

  return {
    fetchGameWithQuestions,
  }
}
