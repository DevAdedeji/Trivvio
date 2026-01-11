import type { Database } from '~/types/supabase'

export const useLobby = (gameId: string) => {
  const client = useSupabaseClient<Database>()
  const players = ref<Database['public']['Tables']['players']['Row'][]>([])

  const fetchPlayers = async () => {
    const { data, error } = await client
      .from('players')
      .select('*')
      .eq('game_id', gameId)
      .order('joined_at', { ascending: true })

    if (data) {
      players.value = data
    }
    return { error }
  }

  let realtimeChannel: ReturnType<typeof client.channel> | null = null

  const subscribeToPlayers = () => {
    // Unsubscribe if exists
    if (realtimeChannel) client.removeChannel(realtimeChannel)

    realtimeChannel = client
      .channel(`game_lobby:${gameId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            players.value.push(payload.new as Database['public']['Tables']['players']['Row'])
          } else if (payload.eventType === 'DELETE') {
            players.value = players.value.filter((p) => p.id !== payload.old.id)
          } else if (payload.eventType === 'UPDATE') {
            const index = players.value.findIndex((p) => p.id === payload.new.id)
            if (index !== -1) {
              players.value[index] = payload.new as Database['public']['Tables']['players']['Row']
            }
          }
        }
      )
      .subscribe()
    return realtimeChannel
  }

  onUnmounted(() => {
     if (realtimeChannel) client.removeChannel(realtimeChannel)
  })

  return {
    players,
    fetchPlayers,
    subscribeToPlayers,
  }
}
