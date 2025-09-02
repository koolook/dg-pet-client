import { useContext, useMemo } from 'react'

import { StoreContext } from '@providers/StoreProvider'

import { ApplicationError, ErrorSeverity } from '@shared/models/ApplicationError'

export interface ErrorHook {
  error: ApplicationError
  setError: (message: string, severity?: ErrorSeverity) => void
  clearError: () => void
}

const useError = () => {
  const { state, dispatch } = useContext(StoreContext)

  return useMemo(
    () =>
      ({
        error: state.error,
        setError: (message: string, severity: ErrorSeverity = 'normal') => {
          dispatch({
            type: 'set_error',
            payload: { message, severity },
          })
        },
        clearError: () => {
          dispatch({ type: 'clear_error' })
        },
      }) as ErrorHook,
    [state.error]
  )
}

export default useError
