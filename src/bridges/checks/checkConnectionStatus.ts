import { supabase } from '../publication/authentication'

const checkConnectionStatus = async (
  accessToken: string | undefined,
  refreshToken: string | undefined
) => {
  if (accessToken != undefined && refreshToken != undefined) {
    const { data, error } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    })
  }
}

export default checkConnectionStatus
