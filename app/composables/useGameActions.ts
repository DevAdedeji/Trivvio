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
    loading.value = true
    const { $toast } = useNuxtApp()

    // 1. Get current auth user
    const { data: { user } } = await client.auth.getUser()
    if (!user) {
      console.error('User not authenticated')
      $toast.error('You must be logged in to start the game')
      loading.value = false
      return { error: 'User not authenticated' }
    }

    // 2. Verify host (simple check, RLS should also catch this but good for UX)
    const { data: game, error: fetchError } = await client
      .from('games')
      .select('user_id')
      .eq('id', gameId)
      .single()

    if (fetchError || !game) {
      $toast.error('Game not found')
      loading.value = false
      return { error: 'Game not found' }
    }

    if (game.user_id !== user.id) {
      $toast.error('Only the host can start the game')
      loading.value = false
      return { error: 'Unauthorized' }
    }

    // 3. Initialize Game State
    // Fetch first question
    const { data: firstQuestion } = await client
      .from('questions')
      .select('time_limit')
      .eq('game_id', gameId)
      .order('order_index', { ascending: true })
      .limit(1)
      .single()

    const timeLimit = firstQuestion?.time_limit || 20
    const roundEndsAt = new Date(Date.now() + timeLimit * 1000).toISOString()

    // 4. Update Game
    const { error } = await client
      .from('games')
      .update({
        status: 'active',
        phase: 'question',
        current_question_index: 0,
        round_ends_at: roundEndsAt
      })
      .eq('id', gameId)

    if (error) {
      $toast.error('Failed to start game')
    }

    loading.value = false
    return { error }
  }

  return {
    loading,
    startLobby,
    startGame,
  }
}
