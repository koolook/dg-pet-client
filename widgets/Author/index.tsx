import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'

import useSession from '@shared/lib/hooks/useSession'

export const Author: React.FC<{ children: ReactNode }> = ({ children }) => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session.canEdit) {
      router.push('/')
    }
  }, [session.canEdit])

  return <>{children}</>
}

export default Author
