import type { Database } from '~/types/supabase'
import type { User } from '@supabase/supabase-js'

export const usePlayer = () => {
  const client = useSupabaseClient<Database>()
  const currentPlayer = ref<Database['public']['Tables']['players']['Row'] | null>(null)

  const checkPlayerStatus = async (gameId: string, authUser: User | null, gameUserId: string) => {
    // 1. Check if Host
    if (authUser && authUser.id === gameUserId) {
      // Host is not a player
      return
    }

    // 2. Check if Guest (by LocalStorage ID)
    const guestId = localStorage.getItem('trivvio_player_id')
    if (guestId) {
      const { data } = await client
        .from('players')
        .select('*')
        .eq('game_id', gameId)
        .eq('player_id', guestId)
        .single()

      if (data) {
        currentPlayer.value = data
      }
    }
  }

  const joinAsGuest = async (gameId: string, nickname: string) => {
    const { $toast } = useNuxtApp()
    let guestId = localStorage.getItem('trivvio_player_id')
    if (!guestId) {
      guestId = crypto.randomUUID()
      localStorage.setItem('trivvio_player_id', guestId)
    }

    const { data, error } = await client
      .from('players')
      .insert({
        game_id: gameId,
        display_name: nickname,
        is_host: false,
        player_id: guestId,
      })
      .select()
      .single()

    if (data) {
      currentPlayer.value = data
      $toast.success('Joined game successfully!')
    }

    if (error) {
       $toast.error('Failed to join game. Please try again.')
    }

    return { data, error }
  }

  return {
    currentPlayer,
    checkPlayerStatus,
    joinAsGuest,
  }
}
