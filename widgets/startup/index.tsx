import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { api } from '@shared/api/api'
import useContentData from '@shared/lib/hooks/useContentData'
import useError from '@shared/lib/hooks/useError'
import useSession, { TOKEN_KEY } from '@shared/lib/hooks/useSession'

const StartupWidget = () => {
  const session = useSession()
  const router = useRouter()
  const feedData = useContentData()
  const errorHook = useError()

  useEffect(() => {
    if (!session.isAuthorized) {
      if (localStorage.getItem(TOKEN_KEY)) {
        console.log(`Has token attempting refresh`)
        api
          .post('/auth/refresh')
          .then((res) => {
            const { userid, roles, login } = res.data
            const token = localStorage.getItem(TOKEN_KEY) || ''
            session.login(token, { id: userid, roles, login })
            session.finishAuth()
          })
          .catch((error) => {
            // Not actually an error. Just an Anonymous mode.
            session.logoff()
            session.finishAuth()
            router.push('/')
          })
      } else {
        session.finishAuth()
        router.push('/')
      }
    }
  }, [session.isAuthorized])

  useEffect(() => {
    const loadFeed = async () => {
      if (session.isAuthDone) {
        console.log('Loading feed...')

        try {
          feedData
          await feedData.load()
        } catch (error) {
          errorHook.setError((error as any).message, 'fatal')
        }
      }
    }
    loadFeed()
  }, [session.isAuthorized, session.isAuthDone])

  return <></>
}

export default StartupWidget
