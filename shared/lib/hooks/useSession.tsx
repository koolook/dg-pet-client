//

import { StoreContext } from '@providers/StoreProvider'
import { useRouter } from 'next/router'
import { useContext, useMemo } from 'react'

export interface User {
  id: string
  login: string
  roles: string[]
}

export interface Session {
  isAuthorized: boolean
  isAuthDone: boolean
  token: string | null
  user: User
  login: (token: string, /* expiredToken: string, */ userData: User) => void
  logoff: () => void
  finishAuth: () => void
}

export const TOKEN_KEY = 'sessionToken'
export const USER_KEY = 'currentUserId'

const useSession = (): Session => {
  const { state, dispatch } = useContext(StoreContext)
  const router = useRouter()
  return useMemo(
    () => ({
      isAuthorized: state.isAuthorized,
      isAuthDone: state.isAuthDone,
      token: state.token,
      user: {
        id: state.userId || '',
        login: state.userLogin || '',
        roles: state.userRoles,
      },
      login: (token: string, userData: User) => {
        localStorage.setItem(TOKEN_KEY, token)
        localStorage.setItem(USER_KEY, userData.id)
        dispatch({
          type: 'authorization',
          payload: {
            token,
            userData,
          },
        })
      },
      logoff: () => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)

        dispatch({
          type: 'logout',
        })
        router.push('/')
      },
      finishAuth: () => {
        dispatch({ type: 'auth_done' })
      },
    }),
    [state.isAuthorized, state.token, state.userId, state.userRoles]
  )
}

export default useSession
