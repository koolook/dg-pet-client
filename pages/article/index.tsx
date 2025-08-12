import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
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
  const [previewUrl, setPreviewUrl] = useState('')

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

  //
  const handleFileChange = (e: ChangeEvent) => {
    const input = e.currentTarget as HTMLInputElement
    const fileList = input.files

    const file = fileList?.item(0)
    if (!file) {
      console.log('No file selected')
      return
    }

    const objectURL = window.URL.createObjectURL(file)
    setPreviewUrl(objectURL)

    console.log(`${file?.name} --- ${file?.size}  --- ${file?.type}`)
    console.log(`objUrl --- ${objectURL}`)

    const preview = document.querySelector<HTMLImageElement>('.preview-image')

    /*     const reader = new FileReader()
    reader.onload = (e) => {
      if (preview) {
        preview.src = e.target?.result?.toString() || ''
      }
    }
    reader.readAsDataURL(file)
 */
    // if (preview) {
    //   preview.src = objectURL
    // }
  }

  useEffect(() => {
    if (!session.isAuthorized && session.isAuthDone) {
      router.push('/')
    }
  }, [session.isAuthorized, session.isAuthDone])

  if (!session.isAuthorized) {
    return <div>Loading...</div>
  }

  return (
    <Layout>
      <Layout.Header canCreate={false} />
      <Layout.Content>
        <div className="vh-100">
          <div className="p-3 m-auto">
            <img className="preview-image" src="" height={200} alt="Image preview"></img>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formUserId">
                <Form.Label>Submit file</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
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

            {previewUrl && (
              <Card>
                <Card.Img width={200} src={previewUrl}></Card.Img>
                <Card.Body>
                  <Card.Title>Preview card</Card.Title>
                  <Card.Text>Упал - встай! Встал - Упай!</Card.Text>
                </Card.Body>
              </Card>
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
