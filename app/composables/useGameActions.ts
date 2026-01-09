import type { Database } from '~/types/supabase'

export const useGameActions = () => {
  const client = useSupabaseClient<Database>()
  const loading = ref(false)

  const updateGameStatus = async (gameId: string, status: string) => {
    loading.value = true
    const { error } = await client
      .from('games')
      .update({ status })
      .eq('id', gameId)

    loading.value = false
    return { error }
  }

  const startLobby = async (gameId: string) => {
    return updateGameStatus(gameId, 'lobby')
  }

  const startGame = async (gameId: string) => {
    return updateGameStatus(gameId, 'active')
  }

  return {
    loading,
    startLobby,
    startGame,
  }
}
