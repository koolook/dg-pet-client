import { ReactNode, createContext, useReducer } from 'react'

import { Article } from '@shared/models/Article'

export interface State {
  userId: string | null
  userLogin: string | null
  userRoles: string[]
  token: string | null
  isAuthorized: boolean
  isAuthDone: boolean
  contentData: Article[]
  dataLoading: boolean
}

const initialState: State = {
  userId: null,
  userLogin: null,
  token: null,
  userRoles: [],
  isAuthorized: false,
  isAuthDone: false,
  contentData: [],
  dataLoading: false,
}

type Action = {
  type:
    | 'authorization'
    | 'auth_done'
    // | 'load_user'
    | 'logout'
    | 'update_content'
    | 'data_loading_start'
    | 'data_loading_done'
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

    case 'update_content':
      return {
        ...state,
        contentData: action.payload.contentData,
      }

    case 'data_loading_start':
      return {
        ...state,
        dataLoading: true,
      }

    case 'data_loading_done':
      return {
        ...state,
        dataLoading: false,
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
