import { FormEvent, useEffect, useState } from 'react'
import { Alert, Button, Card, Form } from 'react-bootstrap'

import { api } from '@shared/api/api'
import useSession from '@shared/lib/hooks/useSession'
import { Layout } from '@widgets/Layout/Layout'
import { useRouter } from 'next/router'
import Image from 'next/image'

const Article = () => {
  const [pending, setPending] = useState(false)
  const [imageList, setImageList] = useState<[number, string][]>([])
  const [error, setError] = useState('')
  const [imgIdx, setImgIdx] = useState(0)

  const session = useSession()
  const router = useRouter()

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setPending(true)

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    api
      .post<{ path: string }>('/auth/upload', formData)
      .then((res) => {
        const { path } = res.data
        setPending(false)
        setImageList([[imgIdx, path], ...imageList])
        setImgIdx(imgIdx + 1)
      })
      .catch((error) => {
        setPending(false)
        setError(error.toJSON())
      })
  }

  useEffect(() => {
    if (!session.isAuthorized) {
      router.push('/login')
    }
  }, [session.isAuthorized])

  if (!session.isAuthorized) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <Layout.Header canCreate={false} />
      <Layout.Content>
        <div className="vh-100">
          <div className="p-3 m-auto">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUserId">
                <Form.Label>Submit file</Form.Label>
                <Form.Control
                  type="file"
                  name="sampleFile"
                  placeholder="Submit file"
                  disabled={pending}
                  //   onChange={(e) => setUserId(e.target.value)}
                />
              </Form.Group>

              {pending ? (
                <Button variant="primary" type="submit" disabled>
                  <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                  <span role="status">Uploading...</span>
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
            <ul>
              {imageList.map(([idx, path]) => (
                <li key={idx}>
                  <Card>
                    <Card.Img src={'http://localhost:4000' + path}></Card.Img>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default Article
