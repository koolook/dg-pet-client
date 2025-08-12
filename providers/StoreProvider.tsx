import { createContext, ReactNode, useReducer } from 'react'

export interface State {
  userId: string | null
  userLogin: string | null
  userRoles: string[]
  token: string | null
  isAuthorized: boolean
  isAuthDone: boolean
}

const initialState: State = {
  userId: null,
  userLogin: null,
  token: null,
  userRoles: [],
  isAuthorized: false,
  isAuthDone: false,
}

type Action = {
  type:
    | 'authorization'
    | 'auth_done'
    // | 'load_user'
    | 'logout'
  payload?: any
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'authorization':
      const {
        token,
        userData: { id, roles, login },
      } = action.payload
      return { ...state, isAuthorized: true, token, userId: id, userRoles: roles, userLogin: login }

    // case 'load_user':
    //     return { ...state }

    case 'logout':
      return {
        ...state,
        isAuthorized: false,
        userId: null,
        userLogin: null,
        userRoles: [],
        token: null,
      }

    case 'auth_done':
      return {
        ...state,
        isAuthDone: true,
      }

    default:
      return { ...state }
  }
}

export const LocalContext = createContext(0)

export const StoreContext = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({ state: initialState, dispatch: () => {} })

const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return <StoreContext value={{ state, dispatch }}>{children}</StoreContext>
}

export default StoreProvider
