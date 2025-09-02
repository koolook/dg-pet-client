import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { Button, Form } from 'react-bootstrap'

import { Layout } from '@widgets/Layout/Layout'

import { api } from '@shared/api/api'
import { asString } from '@shared/helpers'
import useError from '@shared/lib/hooks/useError'

export const SignupForm = () => {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [pending, setPending] = useState(false)
  const [signupComplete, setSignupComplete] = useState(false)
  const errorHook = useError()

  const clearForm = () => {
    setUserId('')
    setPassword('')
    setPassword2('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    console.log(`user: ${userId} password: ${password}`)

    if (password !== password2) {
      errorHook.setError('Password does not match')
      return
    }

    setPending(true)

    try {
      await api.post('/auth/signup', { login: userId.trim(), password })
      setSignupComplete(true)
    } catch (error) {
      errorHook.setError(asString(error))
    } finally {
      setPending(false)
    }
  }

  return (
    <Layout title="Pet-Client | Signup">
      <Layout.Header canCreate={false} />
      <Layout.Content>
        <div className="p-3">
          <h1>Enter new user data</h1>
          {signupComplete ? (
            <span>
              User registration complete. You can <Link href="/login">login</Link> or{' '}
              <Link
                href="#"
                onClick={() => {
                  clearForm()
                  setSignupComplete(false)
                }}
              >
                Signup
              </Link>
              another user.
            </span>
          ) : (
            <Form noValidate onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUserId">
                <Form.Label>User ID</Form.Label>
                <Form.Control
                  required
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
                  required
                  type="password"
                  placeholder="Password"
                  value={password}
                  disabled={pending}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Confirm Password"
                  value={password2}
                  disabled={pending}
                  onChange={(e) => setPassword2(e.target.value)}
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
          )}
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default SignupForm
