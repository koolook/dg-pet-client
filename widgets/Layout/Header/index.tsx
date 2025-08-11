import useSession from '@shared/lib/hooks/useSession'
import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'

export const Header = () => {
  const session = useSession()
  const router = useRouter()

  return (
    <header className="header-container">
      <div className="d-flex flex-row justify-content-between bg-primary text-white p-3 border rounded">
        <div>Header placeholder</div>
        {session.isAuthorized ? (
          <div className="d-flex flex-row">
            <div className="p-3">Logged in as: {session.user.login}</div>
            <Button variant="secondary" onClick={() => session.logoff()}>
              Logoff
            </Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => router.push('/login')}>
            Login
          </Button>
        )}
      </div>
    </header>
  )
}
