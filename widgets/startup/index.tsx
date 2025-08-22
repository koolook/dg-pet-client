import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { api } from '@shared/api/api'
import useContentData from '@shared/lib/hooks/useContentData'
import useSession, { TOKEN_KEY } from '@shared/lib/hooks/useSession'
import { Article } from '@shared/models/Article'

const StartupWidget = () => {
  const session = useSession()
  const router = useRouter()
  const feedData = useContentData()

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
    console.log('Startup effect 2')

    if (session.isAuthDone) {
      console.log('... triggered')
      void feedData.load()
    }
  }, [session.isAuthorized, session.isAuthDone])

  return <></>
}

export default StartupWidget
