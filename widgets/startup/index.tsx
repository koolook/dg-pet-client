import { api } from '@shared/api/api'
import useSession, { TOKEN_KEY } from '@shared/lib/hooks/useSession'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

const StartupWidget = () => {
  const session = useSession()
  const router = useRouter()

  useEffect(() => {
    if (!session.isAuthorized) {
      if (localStorage.getItem(TOKEN_KEY)) {
        console.log(`Has token attempting refresh`)
        api
          .post('/auth/refresh')
          .then((res) => {
            const { userid, roles } = res.data
            const token = localStorage.getItem(TOKEN_KEY) || ''
            session.login(token, { id: userid, roles })
          })
          .catch((error) => {
            session.logoff();
            router.push('/login')
          })
      } else {
        router.push('/login')
      }
    }
  }, [session.isAuthorized])

  return <></>
}

export default StartupWidget
