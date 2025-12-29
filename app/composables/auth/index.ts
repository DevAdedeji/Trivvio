export const useAuth = () => {
  const client = useSupabaseClient()

  const login = async () => {
    const baseUrl = import.meta.env.VITE_PUBLIC_APP_URL
    await client.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${baseUrl}/auth/callback` },
    })
  }

  const logOut = () => {
    client.auth.signOut().then(() => {
      navigateTo({ name: 'index', replace: true })
    })
  }

  const getUser = () => {
    const user = useSupabaseUser()
    return user
  }

  return { logOut, login, getUser }
}
