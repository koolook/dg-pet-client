//
import { useRouter } from 'next/router'
import { useContext, useMemo } from 'react'

import { StoreContext } from '@providers/StoreProvider'

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
  canEdit: boolean
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
        console.log('finishAuth')

        dispatch({ type: 'auth_done' })
      },
      canEdit: state.isAuthorized && state.userRoles.includes('author'),
    }),
    [state.isAuthorized, state.isAuthDone, state.token, state.userId, state.userRoles]
  )
}

export default useSession
