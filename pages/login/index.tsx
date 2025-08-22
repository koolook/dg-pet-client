import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'

import { Layout } from '@widgets/Layout/Layout'

import { api } from '@shared/api/api'
import useSession from '@shared/lib/hooks/useSession'

interface ILoginResponse {
  token: string
  id: string
  login: string
  roles: string[]
}

const LoginForm = () => {
  const session = useSession()
  const router = useRouter()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    console.log(`user: ${userId} password: ${password}`)
    setPending(true)
    api
      .post<ILoginResponse>('/auth/login', { login: userId.trim(), password })
      .then((res) => {
        const { token, id, roles, login } = res.data
        session.login(token, { id, roles, login })
        session.finishAuth()
        router.push('/')
      })
      .catch((error) => {
        setPending(false)
        setError(error.toJSON())
      })
  }
  return (
    <Layout title="Pet-Client | Login">
      <Layout.Header canCreate={false} />
      <Layout.Content>
        <div className="p-3">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formUserId">
              <Form.Label>User ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter User ID"
                value={userId}
                disabled={pending}
                onChange={(e) => setUserId(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                disabled={pending}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {pending ? (
              <Button variant="primary" type="submit" disabled>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span role="status">Loading...</span>
              </Button>
            ) : (
              <Button variant="primary" type="submit">
                <span>Submit</span>
              </Button>
            )}
          </Form>
          {error && (
            <Alert className="mt-3" variant="danger" onClose={() => setError('')} dismissible>
              error
            </Alert>
          )}
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default LoginForm
