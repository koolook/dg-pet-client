import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'react-bootstrap'

import useSession from '@shared/lib/hooks/useSession'

export interface HeaderOptions {
  canCreate: boolean
}

export const Header: React.FC<HeaderOptions> = ({ canCreate = true }) => {
  const session = useSession()
  const router = useRouter()

  return (
    <header className="header-container">
      <div className="d-flex flex-row justify-content-between bg-primary text-white p-3 border rounded">
        <Link href="/" className="text-white">
          Home
        </Link>
        {session.isAuthorized && canCreate && (
          <Button variant="secondary" onClick={() => router.push('/article')}>
            Create new
          </Button>
        )}
        {session.isAuthorized ? (
          <div className="d-flex flex-row">
            <div className="p-3">Logged in as: {session.user.login}</div>
            <Button variant="secondary" onClick={() => session.logoff()}>
              Logoff
            </Button>
          </div>
        ) : (
          <div className="d-flex flex-row gap-2">
            <Button variant="secondary" onClick={() => router.push('/login')}>
              Login
            </Button>
            <Button variant="secondary" onClick={() => router.push('/signup')}>
              SignUp
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
