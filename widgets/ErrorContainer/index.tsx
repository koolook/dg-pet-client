import { ReactNode, useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'

import useError from '@shared/lib/hooks/useError'

export type LayoutProps = { children?: ReactNode }

export const ErrorContainer: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const errorHook = useError()
  const [isFatal, setIsFatal] = useState(false)

  useEffect(() => {
    setIsFatal(errorHook.error?.severity === 'fatal')
  }, [errorHook.error])

  const handleClose = () => errorHook.clearError()

  return (
    <>
      {!isFatal && children}
      <Modal show={!!errorHook.error} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton={!isFatal}>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorHook.error?.message || ''}</Modal.Body>
        {!isFatal && (
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        )}
      </Modal>
    </>
  )
}
