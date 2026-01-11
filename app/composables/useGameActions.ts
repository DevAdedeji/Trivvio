import type { Database } from '~/types/supabase'

export const useGameActions = () => {
  const client = useSupabaseClient<Database>()
  const loading = ref(false)

  const updateGameStatus = async (gameId: string, status: string) => {
    loading.value = true
    const { $toast } = useNuxtApp()

    // 1. Get current auth user
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
      console.error('User not authenticated')
      $toast.error('You must be logged in to update game status')
      loading.value = false
      return { error: 'User not authenticated' }
    }

    // 2. Verify host matches game owner
    const { data: game, error: fetchError } = await client
      .from('games')
      .select('user_id')
      .eq('id', gameId)
      .single()

    if (fetchError || !game) {
      console.error('Failed to fetch game details:', fetchError)
      $toast.error('Failed to verify game ownership')
      loading.value = false
      return { error: fetchError || 'Game not found' }
    }

    if (game.user_id !== user.id) {
      console.error('User is not the host')
      $toast.error('Only the host can update the game status')
      loading.value = false
      return { error: 'Unauthorized: Only host can update game status' }
    }

    // 3. Update Status
    const { error } = await client
      .from('games')
      .update({ status })
      .eq('id', gameId)

    if (error) {
      $toast.error('Failed to update game status')
    }

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
